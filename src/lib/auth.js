import "server-only";
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { queryOne, executeSql } from "@/lib/db";

// Admin authentication (server only).
//
// Configuration, set as server-only environment variables on the host (never NEXT_PUBLIC_):
//   ADMIN_SESSION_SECRET  random string of at least 32 characters; signs session cookies
//   ADMIN_PIN             the admin login PIN, used until a new PIN is set in Admin -> Settings
// If ADMIN_SESSION_SECRET is missing, or there is neither a stored PIN hash nor ADMIN_PIN,
// every admin login and admin API request is refused. There is no default PIN.
//
// A PIN changed in Admin -> Settings is stored only as a salted scrypt hash (settings key
// "admin_pin_hash") and then takes precedence over ADMIN_PIN. Sessions are HMAC-signed cookies
// bound to the current credential, so changing the PIN signs out every other session.

const scrypt = promisify(scryptCb);
const COOKIE = "ae_admin";
const SESSION_SECONDS = 8 * 60 * 60;
const HASH_KEY = "admin_pin_hash";
export const MIN_PIN_LENGTH = 8;

function sessionSecret() {
  const s = process.env.ADMIN_SESSION_SECRET || "";
  return s.length >= 32 ? s : null;
}

function sha256(value) {
  return createHash("sha256").update(String(value)).digest();
}

function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

async function storedHash() {
  try {
    const row = await queryOne("SELECT value FROM settings WHERE key = ?", [HASH_KEY]);
    return row?.value || null;
  } catch {
    return null;
  }
}

// The credential currently in force, or null when nothing is configured.
async function currentCredential() {
  const hash = await storedHash();
  if (hash) return { type: "hash", value: hash };
  const envPin = process.env.ADMIN_PIN || "";
  if (envPin) return { type: "env", value: envPin };
  return null;
}

async function hashPin(pin) {
  const salt = randomBytes(16);
  const key = await scrypt(String(pin), salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$${salt.toString("base64")}$${key.toString("base64")}`;
}

async function verifyHash(pin, stored) {
  const [alg, n, saltB64, keyB64] = String(stored).split("$");
  if (alg !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const key = await scrypt(String(pin), Buffer.from(saltB64, "base64"), expected.length, { N: Number(n), r: 8, p: 1 });
  return timingSafeEqual(key, expected);
}

async function checkPin(pin, cred) {
  if (!cred || typeof pin !== "string" || !pin) return false;
  if (cred.type === "hash") return verifyHash(pin, cred.value);
  return safeEqual(sha256(pin), sha256(cred.value)); // hashing first keeps the compare length-independent
}

// Binds a session to the credential in force: a new PIN invalidates older cookies.
function credentialTag(secret, cred) {
  const id = cred.type === "hash" ? cred.value : "env:" + sha256(cred.value).toString("hex");
  return createHmac("sha256", secret).update("cred:" + id).digest("base64url").slice(0, 22);
}

function sign(secret, payload) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

async function issueSession(cred) {
  const secret = sessionSecret();
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `v1.${exp}.${randomBytes(12).toString("base64url")}.${credentialTag(secret, cred)}`;
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sign(secret, payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdmin() {
  // Read the cookie first: this marks the route as request-time, so it is never prerendered.
  const token = (await cookies()).get(COOKIE)?.value;
  const secret = sessionSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== "v1") return false;
  const payload = parts.slice(0, 4).join(".");
  if (!safeEqual(parts[4], sign(secret, payload))) return false;
  if (Number(parts[1]) * 1000 < Date.now()) return false;
  const cred = await currentCredential();
  return Boolean(cred) && safeEqual(parts[3], credentialTag(secret, cred));
}

// For API route handlers: returns a 401 response when the caller is not a signed-in admin.
export async function requireAdmin() {
  if (await isAdmin()) return null;
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

// ---------- Login throttling (best effort, per server instance) ----------
const failures = new Map(); // ip -> { count, until }
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;

export function clientIp(req) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

function lockedOut(ip) {
  const f = failures.get(ip);
  if (!f) return false;
  if (f.until && f.until > Date.now()) return true;
  if (f.until && f.until <= Date.now()) failures.delete(ip);
  return false;
}

function recordFailure(ip) {
  const f = failures.get(ip) || { count: 0, until: 0 };
  f.count += 1;
  if (f.count >= MAX_FAILURES) f.until = Date.now() + LOCK_MS;
  failures.set(ip, f);
}

// Returns "ok" | "invalid" | "locked" | "unconfigured".
export async function login(pin, ip) {
  if (!sessionSecret()) return "unconfigured";
  const cred = await currentCredential();
  if (!cred) return "unconfigured";
  if (lockedOut(ip)) return "locked";
  if (!(await checkPin(pin, cred))) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 400));
    return "invalid";
  }
  failures.delete(ip);
  await issueSession(cred);
  return "ok";
}

// Returns "ok" | "invalid" | "weak" | "unconfigured". Caller must already be an admin.
export async function changePin(currentPin, newPin) {
  if (!sessionSecret()) return "unconfigured";
  const cred = await currentCredential();
  if (!cred) return "unconfigured";
  if (!(await checkPin(currentPin, cred))) {
    await new Promise((r) => setTimeout(r, 400));
    return "invalid";
  }
  if (typeof newPin !== "string" || newPin.length < MIN_PIN_LENGTH) return "weak";
  const hash = await hashPin(newPin);
  await executeSql(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [HASH_KEY, hash]
  );
  await issueSession({ type: "hash", value: hash }); // keep this browser signed in
  return "ok";
}
