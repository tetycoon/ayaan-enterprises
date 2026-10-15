import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { queryAll, executeSql, getNextSqlId } from "@/lib/db";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const rows = await queryAll("SELECT * FROM quotes ORDER BY created_at DESC");
    const parsed = rows.map((r) => ({
      id: r.id,
      createdAt: r.created_at,
      customerName: r.customer_name,
      company: r.company,
      phone: r.phone,
      status: r.status,
      items: r.items ? JSON.parse(r.items) : []
    }));
    return NextResponse.json({ success: true, quotes: parsed });
  } catch (err) {
    console.error("GET /api/quotes error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await req.json();
    const id = body.id || (await getNextSqlId("QT"));

    await executeSql(
      `INSERT INTO quotes (id, created_at, customer_name, company, phone, status, items)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.createdAt || new Date().toISOString(),
        body.customerName || "Customer",
        body.company || "",
        body.phone || "",
        body.status || "Draft",
        JSON.stringify(body.items || [])
      ]
    );

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("POST /api/quotes error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }
    await executeSql("UPDATE quotes SET status = ? WHERE id = ?", [status, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/quotes error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }
    await executeSql("DELETE FROM quotes WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/quotes error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
