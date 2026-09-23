// Setup database: menjalankan db/schema.sql terhadap DATABASE_URL.
// Kredensial dibaca dari environment, tidak pernah ditulis di kode.
// Jalankan:  node scripts/setup-db.mjs   (dengan DATABASE_URL diset)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL belum diset.");
  process.exit(1);
}

const schemaPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "db",
  "schema.sql",
);

const pool = new Pool({ connectionString });

try {
  const sql = readFileSync(schemaPath, "utf8");
  await pool.query(sql);
  const { rows } = await pool.query(
    "SELECT to_regclass('public.pesan') AS tabel",
  );
  console.log(
    rows[0].tabel
      ? "Tabel 'pesan' siap: ADA ✓"
      : "Tabel 'pesan': TIDAK ADA ✗",
  );
} catch (err) {
  console.error("Gagal setup database:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}