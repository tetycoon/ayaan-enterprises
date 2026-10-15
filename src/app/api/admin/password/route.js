import { NextResponse } from "next/server";
import { requireAdmin, changePin, MIN_PIN_LENGTH } from "@/lib/auth";

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body = {};
  try {
    body = await req.json();
  } catch {
    // validated below
  }
  const result = await changePin(String(body?.currentPin ?? ""), String(body?.newPin ?? ""));
  if (result === "ok") return NextResponse.json({ success: true });
  if (result === "weak") {
    return NextResponse.json({ success: false, error: `New PIN must be at least ${MIN_PIN_LENGTH} characters.` }, { status: 400 });
  }
  if (result === "unconfigured") {
    return NextResponse.json({ success: false, error: "Admin login is not configured on the server." }, { status: 503 });
  }
  return NextResponse.json({ success: false, error: "Current PIN is incorrect." }, { status: 401 });
}
