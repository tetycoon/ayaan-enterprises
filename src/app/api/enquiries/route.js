import { NextResponse } from "next/server";
import { queryAll, executeSql, getNextSqlId } from "@/lib/db";

export async function GET() {
  try {
    const rows = await queryAll("SELECT * FROM enquiries ORDER BY created_at DESC");
    const parsed = rows.map((r) => ({
      ...r,
      problems: r.problems ? JSON.parse(r.problems) : [],
      chairTypes: r.chair_types ? JSON.parse(r.chair_types) : [],
      notes: r.notes ? JSON.parse(r.notes) : [],
      photos: r.photos ? JSON.parse(r.photos) : []
    }));
    return NextResponse.json({ success: true, enquiries: parsed });
  } catch (err) {
    console.error("GET /api/enquiries error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const id = body.id || (await getNextSqlId("ENQ"));

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

export async function PATCH(req) {
  try {
    const { id, status, notes } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing enquiry id" }, { status: 400 });
    }

    if (status && notes) {
      await executeSql(
        "UPDATE enquiries SET status = ?, notes = ? WHERE id = ?",
        [status, JSON.stringify(notes), id]
      );
    } else if (status) {
      await executeSql("UPDATE enquiries SET status = ? WHERE id = ?", [status, id]);
    } else if (notes) {
      await executeSql("UPDATE enquiries SET notes = ? WHERE id = ?", [JSON.stringify(notes), id]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/enquiries error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }
    await executeSql("DELETE FROM enquiries WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/enquiries error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
