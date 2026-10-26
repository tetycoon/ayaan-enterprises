import { NextResponse } from "next/server";
import { executeSql, getNextSqlId } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    // Website forms post here without signing in, so the server picks the id, status and notes.
    delete body.id;
    delete body.status;
    delete body.notes;
    const id = await getNextSqlId("ENQ");

    await executeSql(
      `INSERT INTO enquiries (
        id, created_at, name, company, phone, city, service, quantity,
        problems, chair_types, message, status, source, notes, photos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.createdAt || new Date().toISOString(),
        body.name || "Customer",
        body.company || "",
        body.phone || "",
        body.city || "Chennai",
        body.service || "Chair Repair & Spares",
        Number(body.quantity) || 1,
        JSON.stringify(body.problems || []),
        JSON.stringify(body.chairTypes || []),
        body.message || "",
        body.status || "New",
        body.source || "Website Form",
        JSON.stringify(body.notes || []),
        JSON.stringify(body.photos || [])
      ]
    );

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("POST /api/enquiries error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
