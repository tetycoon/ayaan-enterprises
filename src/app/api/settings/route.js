import { NextResponse } from "next/server";
import { queryAll, executeSql } from "@/lib/db";
import { SITE } from "@/lib/config";

export async function GET() {
  try {
    const rows = await queryAll("SELECT key, value FROM settings");
    const settings = {
      businessName: SITE.name || "Ayaan Enterprises",
      phone: SITE.phone || "+91 81222 33887",
      address: SITE.address || "2nd Floor, ANANDHAM ELITE, 1, MRTS Road, 1st Street, Velachery, Chennai, Tamil Nadu 600042, India.",
      gstin: "33AABCA1234F1Z9",
      bank: "Bank: HDFC Bank\nA/c No: 50200081223388\nIFSC: HDFC0001234\nBranch: Guindy, Chennai",
      gstPct: 18,
      quoteTerms: "1. Rates inclusive of genuine spare parts and expert on-site labor.\n2. Work executed in staggered batches without interrupting office operations.\n3. 90-day comprehensive on-site warranty.\n4. 50% advance on PO, 50% upon satisfactory batch completion.",
      pin: "Ayaan@2026"
    };

    rows.forEach((r) => {
      if (r.key === "gstPct") {
        settings[r.key] = Number(r.value);
      } else {
        settings[r.key] = r.value;
      }
    });

    const pgUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
    return NextResponse.json({
      success: true,
      dbEngine: pgUrl ? (pgUrl.includes("postgres") ? "postgres" : "other") : "sqlite",
      hasDatabaseUrl: Boolean(pgUrl),
      settings
    });
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const entries = Object.entries(body);

    for (const [key, val] of entries) {
      const strVal = String(val);
      // Upsert into SQL settings
      await executeSql(
        `INSERT INTO settings (key, value) VALUES (?, ?)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, strVal]
      );
    }

    return NextResponse.json({ success: true, message: "Settings saved to SQL database" });
  } catch (err) {
    console.error("POST /api/settings error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
