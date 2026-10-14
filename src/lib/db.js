import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { SITE } from "./config.js";

let sqliteDbInstance = null;
let isInitialized = false;

// Determine database path for local or serverless environments
function getSqlitePath() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "chair_service.db");
  }
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn("Could not create data dir, falling back to /tmp:", e);
      return path.join("/tmp", "chair_service.db");
    }
  }
  return path.join(dir, "chair_service.db");
}

function getSqliteDb() {
  if (!sqliteDbInstance) {
    const dbPath = getSqlitePath();
    sqliteDbInstance = new DatabaseSync(dbPath);
  }
  return sqliteDbInstance;
}

// PostgreSQL connection using @neondatabase/serverless if URL is provided
function getPostgresUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || null;
}

export async function initDb(force = false) {
  if (isInitialized && !force) return;

  const pgUrl = getPostgresUrl();
  if (pgUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(pgUrl);

      // Self-heal: If an empty legacy table exists from an earlier test where id was integer, drop it to recreate cleanly
      for (const tbl of ["enquiries", "quotes", "jobs"]) {
        try {
          const idCol = await sql.query(
            "SELECT data_type FROM information_schema.columns WHERE table_name = $1 AND column_name = 'id'",
            [tbl]
          );
          if (idCol && idCol.length > 0 && idCol[0].data_type === "integer") {
            const countRes = await sql.query(`SELECT count(*) as c FROM ${tbl}`);
            if (countRes && Number(countRes[0]?.c || 0) === 0) {
              await sql.query(`DROP TABLE IF EXISTS ${tbl} CASCADE`);
            }
          }
        } catch (e) {
          // ignore check error
        }
      }

      await sql.query(`
        CREATE TABLE IF NOT EXISTS enquiries (
          id VARCHAR(32) PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          name VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          phone VARCHAR(50) NOT NULL,
          city VARCHAR(100),
          service VARCHAR(100),
          quantity INTEGER DEFAULT 1,
          problems TEXT,
          chair_types TEXT,
          message TEXT,
          status VARCHAR(50) DEFAULT 'New',
          source VARCHAR(100),
          notes TEXT,
          photos TEXT
        )
      `);

      await sql.query(`
        CREATE TABLE IF NOT EXISTS quotes (
          id VARCHAR(32) PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          customer_name VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          phone VARCHAR(50),
          status VARCHAR(50) DEFAULT 'Draft',
          items TEXT
        )
      `);

      await sql.query(`
        CREATE TABLE IF NOT EXISTS jobs (
          id VARCHAR(32) PRIMARY KEY,
          customer_name VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          technician VARCHAR(100),
          chairs INTEGER DEFAULT 1,
          progress VARCHAR(20) DEFAULT '0%',
          scheduled_date VARCHAR(100),
          status VARCHAR(50) DEFAULT 'Scheduled',
          notes TEXT
        )
      `);

      await sql.query(`
        CREATE TABLE IF NOT EXISTS settings (
          key VARCHAR(100) PRIMARY KEY,
          value TEXT
        )
      `);

      await sql.query(`
        CREATE TABLE IF NOT EXISTS counters (
          prefix VARCHAR(20) PRIMARY KEY,
          current_val INTEGER DEFAULT 1000
        )
      `);

      // Ensure all columns exist in case table was created previously with a partial schema
      const migrations = [
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS name VARCHAR(255)",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS phone VARCHAR(50)",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS company VARCHAR(255)",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS city VARCHAR(100)",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS service VARCHAR(100)",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS problems TEXT",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS chair_types TEXT",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS message TEXT",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'New'",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS source VARCHAR(100)",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS notes TEXT",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS photos TEXT",
        "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS company VARCHAR(255)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS phone VARCHAR(50)",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Draft'",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS items TEXT",
        "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS phone VARCHAR(50)",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS technician VARCHAR(100)",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS chairs INTEGER DEFAULT 1",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS progress VARCHAR(20) DEFAULT '0%'",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS scheduled_date VARCHAR(100)",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Scheduled'",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS notes TEXT"
      ];
      for (const m of migrations) {
        try {
          await sql.query(m);
        } catch (e) {
          // ignore harmless alter error
        }
      }

      // Convert id columns to VARCHAR(64) in case older table defined them as integer
      const typeFixes = [
        "ALTER TABLE enquiries ALTER COLUMN id DROP DEFAULT",
        "ALTER TABLE enquiries ALTER COLUMN id TYPE VARCHAR(64) USING id::text",
        "ALTER TABLE quotes ALTER COLUMN id DROP DEFAULT",
        "ALTER TABLE quotes ALTER COLUMN id TYPE VARCHAR(64) USING id::text",
        "ALTER TABLE jobs ALTER COLUMN id DROP DEFAULT",
        "ALTER TABLE jobs ALTER COLUMN id TYPE VARCHAR(64) USING id::text"
      ];
      for (const tf of typeFixes) {
        try {
          await sql.query(tf);
        } catch (e) {
          // ignore harmless alter error
        }
      }

      // Seed default settings and password in Postgres if not exists
      const existingPin = await sql.query("SELECT value FROM settings WHERE key = $1", ["pin"]);
      if (!existingPin || existingPin.length === 0) {
        await sql.query(
          "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
          ["pin", "Ayaan@2026"]
        );
        await sql.query(
          "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
          ["businessName", SITE.name || "Ayaan Enterprises"]
        );
        await sql.query(
          "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
          ["phone", SITE.phone || "+91 81222 33887"]
        );
        await sql.query(
          "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
          ["address", SITE.address || "Plot No. 18, SIDCO Industrial Estate, Guindy, Chennai - 600032"]
        );
        await sql.query(
          "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
          ["gstin", "33AABCA1234F1Z9"]
        );
        await sql.query(
          "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
          ["gstPct", "18"]
        );
      }

      isInitialized = true;
      return;
    } catch (err) {
      console.error("Postgres initialization error, falling back to SQLite:", err);
    }
  }

  // SQLite Initialization
  try {
    const db = getSqliteDb();
    db.exec(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id TEXT PRIMARY KEY,
        created_at TEXT DEFAULT (datetime('now')),
        name TEXT NOT NULL,
        company TEXT,
        phone TEXT NOT NULL,
        city TEXT,
        service TEXT,
        quantity INTEGER DEFAULT 1,
        problems TEXT,
        chair_types TEXT,
        message TEXT,
        status TEXT DEFAULT 'New',
        source TEXT,
        notes TEXT,
        photos TEXT
      );

      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        created_at TEXT DEFAULT (datetime('now')),
        customer_name TEXT NOT NULL,
        company TEXT,
        phone TEXT,
        status TEXT DEFAULT 'Draft',
        items TEXT
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        phone TEXT,
        technician TEXT,
        chairs INTEGER DEFAULT 1,
        progress TEXT DEFAULT '0%',
        scheduled_date TEXT,
        status TEXT DEFAULT 'Scheduled',
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );

      CREATE TABLE IF NOT EXISTS counters (
        prefix TEXT PRIMARY KEY,
        current_val INTEGER DEFAULT 1000
      );
    `);

    // Seed default password in SQLite if not present
    const pinRow = db.prepare("SELECT value FROM settings WHERE key = ?").get("pin");
    if (!pinRow) {
      db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run("pin", "Ayaan@2026");
      db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run("businessName", SITE.name || "Ayaan Enterprises");
      db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run("phone", SITE.phone || "+91 81222 33887");
      db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run("address", SITE.address || "Plot No. 18, SIDCO Industrial Estate, Guindy, Chennai - 600032");
      db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run("gstin", "33AABCA1234F1Z9");
      db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run("gstPct", "18");
    }

    isInitialized = true;
  } catch (err) {
    console.error("SQLite initialization error:", err);
  }
}

// Next sequential ID helper (e.g. ENQ-1001, QT-1001, JOB-1001)
export async function getNextSqlId(prefix) {
  await initDb();
  const pgUrl = getPostgresUrl();

  let tblName = "enquiries";
  if (prefix === "QT") tblName = "quotes";
  if (prefix === "JOB") tblName = "jobs";

  if (pgUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(pgUrl);

      // Find highest numerical suffix in table
      let currentMax = 1000;
      try {
        const rows = await sql.query(`SELECT id FROM ${tblName}`);
        for (const r of rows) {
          const num = parseInt(String(r.id).replace(/\D/g, ""), 10);
          if (!isNaN(num) && num > currentMax) currentMax = num;
        }
      } catch (e) {
        // ignore if table empty or query failed
      }

      const rows = await sql.query(
        `INSERT INTO counters (prefix, current_val)
         VALUES ($1, $2)
         ON CONFLICT (prefix)
         DO UPDATE SET current_val = GREATEST(counters.current_val + 1, $2)
         RETURNING current_val`,
        [prefix, currentMax + 1]
      );
      if (rows && rows.length > 0) {
        return `${prefix}-${rows[0].current_val}`;
      }
    } catch (e) {
      console.warn("Postgres counter error, using fallback counter:", e);
    }
  }

  const db = getSqliteDb();
  try {
    let currentMax = 1000;
    try {
      const rows = db.prepare(`SELECT id FROM ${tblName}`).all();
      for (const r of rows) {
        const num = parseInt(String(r.id).replace(/\D/g, ""), 10);
        if (!isNaN(num) && num > currentMax) currentMax = num;
      }
    } catch (e) {
      // ignore
    }

    const row = db.prepare("SELECT current_val FROM counters WHERE prefix = ?").get(prefix);
    const nextVal = Math.max(currentMax + 1, row ? Number(row.current_val) + 1 : 1001);
    if (row) {
      db.prepare("UPDATE counters SET current_val = ? WHERE prefix = ?").run(nextVal, prefix);
    } else {
      db.prepare("INSERT INTO counters (prefix, current_val) VALUES (?, ?)").run(prefix, nextVal);
    }
    return `${prefix}-${nextVal}`;
  } catch (err) {
    if (err.message && err.message.includes("no such table")) {
      isInitialized = false;
      await initDb(true);
      const row = db.prepare("SELECT current_val FROM counters WHERE prefix = ?").get(prefix);
      let nextVal = 1001;
      if (row) {
        nextVal = Number(row.current_val) + 1;
        db.prepare("UPDATE counters SET current_val = ? WHERE prefix = ?").run(nextVal, prefix);
      } else {
        db.prepare("INSERT INTO counters (prefix, current_val) VALUES (?, ?)").run(prefix, nextVal);
      }
      return `${prefix}-${nextVal}`;
    }
    throw err;
  }
}

// Universal Query Helper with auto-recovery
export async function queryAll(sqlQuery, params = []) {
  await initDb();
  const pgUrl = getPostgresUrl();

  if (pgUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(pgUrl);
      let paramIdx = 1;
      const pgQuery = sqlQuery.replace(/\?/g, () => `$${paramIdx++}`);
      const rows = await sql.query(pgQuery, params);
      return rows;
    } catch (e) {
      if (e.message && (e.message.includes("does not exist") || e.message.includes("relation"))) {
        isInitialized = false;
        await initDb(true);
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(pgUrl);
        let paramIdx = 1;
        const pgQuery = sqlQuery.replace(/\?/g, () => `$${paramIdx++}`);
        return await sql.query(pgQuery, params);
      }
      throw e;
    }
  }

  const db = getSqliteDb();
  try {
    const stmt = db.prepare(sqlQuery);
    return stmt.all(...params);
  } catch (err) {
    if (err.message && err.message.includes("no such table")) {
      isInitialized = false;
      await initDb(true);
      const stmt = db.prepare(sqlQuery);
      return stmt.all(...params);
    }
    throw err;
  }
}

// Universal Get Single Row Helper
export async function queryOne(sqlQuery, params = []) {
  const rows = await queryAll(sqlQuery, params);
  return rows[0] || null;
}

// Universal Execute (INSERT / UPDATE / DELETE) Helper with auto-recovery
export async function executeSql(sqlQuery, params = []) {
  await initDb();
  const pgUrl = getPostgresUrl();

  if (pgUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(pgUrl);
      let paramIdx = 1;
      const pgQuery = sqlQuery.replace(/\?/g, () => `$${paramIdx++}`);
      const result = await sql.query(pgQuery, params);
      return { success: true, changes: result.rowCount || result.length || 1 };
    } catch (e) {
      if (e.message && (e.message.includes("does not exist") || e.message.includes("relation"))) {
        isInitialized = false;
        await initDb(true);
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(pgUrl);
        let paramIdx = 1;
        const pgQuery = sqlQuery.replace(/\?/g, () => `$${paramIdx++}`);
        const result = await sql.query(pgQuery, params);
        return { success: true, changes: result.rowCount || result.length || 1 };
      }
      throw e;
    }
  }

  const db = getSqliteDb();
  try {
    const stmt = db.prepare(sqlQuery);
    const result = stmt.run(...params);
    return { success: true, changes: result.changes, lastInsertRowid: result.lastInsertRowid };
  } catch (err) {
    if (err.message && err.message.includes("no such table")) {
      isInitialized = false;
      await initDb(true);
      const stmt = db.prepare(sqlQuery);
      const result = stmt.run(...params);
      return { success: true, changes: result.changes, lastInsertRowid: result.lastInsertRowid };
    }
    throw err;
  }
}
