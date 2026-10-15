import { NextResponse } from "next/server";
import { login, clientIp } from "@/lib/auth";

export async function POST(req) {
  let pin = "";
  try {
    pin = String((await req.json())?.pin ?? "");
  } catch {
    // treated as an invalid PIN below
  }
  const result = await login(pin, clientIp(req));
  if (result === "ok") return NextResponse.json({ success: true });
  if (result === "locked") {
    return NextResponse.json({ success: false, error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  if (result === "unconfigured") {
    console.error("Admin login unavailable: ADMIN_SESSION_SECRET and/or ADMIN_PIN are not configured.");
    return NextResponse.json({ success: false, error: "Admin login is not configured on the server." }, { status: 503 });
  }
  return NextResponse.json({ success: false, error: "Incorrect PIN." }, { status: 401 });
}
