import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { executeSql, initDb } from "@/lib/db";
import { getSampleEnterpriseData } from "@/lib/store";

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    await initDb(true);
    const sample = getSampleEnterpriseData();

    // 1. Seed enquiries
    for (const enq of sample.enquiries) {
      await executeSql(
        `INSERT INTO enquiries (
          id, created_at, name, company, phone, city, service, quantity,
          problems, chair_types, message, status, source, notes, photos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          status = EXCLUDED.status,
          service = EXCLUDED.service,
          quantity = EXCLUDED.quantity`,
        [
          enq.id,
          enq.createdAt,
          enq.name,
          enq.company,
          enq.phone,
          enq.city,
          enq.service,
          enq.quantity,
          JSON.stringify(enq.problems || []),
          JSON.stringify(enq.chairTypes || []),
          enq.message || "",
          enq.status,
          enq.source,
          JSON.stringify(enq.notes || []),
          JSON.stringify(enq.photos || [])
        ]
      );
    }

    // 2. Seed quotes
    for (const q of sample.quotes) {
      await executeSql(
        `INSERT INTO quotes (id, created_at, customer_name, company, phone, status, items)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (id) DO UPDATE SET
           status = EXCLUDED.status,
           items = EXCLUDED.items`,
        [
          q.id,
          q.createdAt,
          q.customerName,
          q.company,
          q.phone,
          q.status,
          JSON.stringify(q.items || [])
        ]
      );
    }

    // 3. Seed jobs
    for (const j of sample.jobs) {
      await executeSql(
        `INSERT INTO jobs (id, customer_name, phone, technician, chairs, progress, scheduled_date, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (id) DO UPDATE SET
           status = EXCLUDED.status,
           progress = EXCLUDED.progress`,
        [
          j.id,
          j.customerName,
          j.phone,
          j.technician,
          j.chairs,
          j.progress,
          j.scheduledDate,
          j.status,
          j.notes
        ]
      );
    }

    // 4. Sync counters to seeded heights
    await executeSql(
      `INSERT INTO counters (prefix, current_val) VALUES ('ENQ', 1005)
       ON CONFLICT (prefix) DO UPDATE SET current_val = GREATEST(counters.current_val, 1005)`,
      []
    );
    await executeSql(
      `INSERT INTO counters (prefix, current_val) VALUES ('QT', 1002)
       ON CONFLICT (prefix) DO UPDATE SET current_val = GREATEST(counters.current_val, 1002)`,
      []
    );
    await executeSql(
      `INSERT INTO counters (prefix, current_val) VALUES ('JOB', 1002)
       ON CONFLICT (prefix) DO UPDATE SET current_val = GREATEST(counters.current_val, 1002)`,
      []
    );

    return NextResponse.json({
      success: true,
      message: "Seeded 5 Chennai enterprise leads, quotes, and jobs into SQL database"
    });
  } catch (err) {
    console.error("POST /api/seed error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
