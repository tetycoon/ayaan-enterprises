import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { queryAll, executeSql, getNextSqlId } from "@/lib/db";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const rows = await queryAll("SELECT * FROM jobs ORDER BY id DESC");
    const parsed = rows.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      phone: r.phone,
      technician: r.technician,
      chairs: r.chairs,
      progress: r.progress,
      scheduledDate: r.scheduled_date,
      status: r.status,
      notes: r.notes
    }));
    return NextResponse.json({ success: true, jobs: parsed });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await req.json();
    const id = body.id || (await getNextSqlId("JOB"));

    await executeSql(
      `INSERT INTO jobs (id, customer_name, phone, technician, chairs, progress, scheduled_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.customerName || "Customer",
        body.phone || "",
        body.technician || "Unassigned",
        Number(body.chairs) || 1,
        body.progress || "0%",
        body.scheduledDate || "This Week",
        body.status || "Scheduled",
        body.notes || ""
      ]
    );

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id, status, progress } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    if (status && progress) {
      await executeSql("UPDATE jobs SET status = ?, progress = ? WHERE id = ?", [status, progress, id]);
    } else if (status) {
      await executeSql("UPDATE jobs SET status = ? WHERE id = ?", [status, id]);
    } else if (progress) {
      await executeSql("UPDATE jobs SET progress = ? WHERE id = ?", [progress, id]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/jobs error:", err);
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
    await executeSql("DELETE FROM jobs WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/jobs error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
