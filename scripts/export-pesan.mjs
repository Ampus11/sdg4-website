// Ekspor semua pesan dari tabel "pesan" ke data/pesan.csv (lengkap dengan BOM untuk Excel).
// Jalankan:  node scripts/export-pesan.mjs   (dengan DATABASE_URL diset)
import { writeFileSync, mkdirSync } from "node:fs";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL belum diset.");
  process.exit(1);
}

const pool = new Pool({ connectionString });

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

try {
  const { rows } = await pool.query(
    "SELECT id, nama, surel, isi, dibuat_pada FROM pesan ORDER BY dibuat_pada DESC",
  );

  const csv = [
    "id,nama,surel,isi,dibuat_pada",
    ...rows.map((x) =>
      [x.id, x.nama, x.surel, x.isi, new Date(x.dibuat_pada).toLocaleString("id-ID")].map(esc).join(","),
    ),
  ].join("\r\n");

  mkdirSync("data", { recursive: true });
  writeFileSync("data/pesan.csv", "\uFEFF" + csv, "utf8");

  console.log(`Tersimpan: data/pesan.csv (${rows.length} pesan)`);
} catch (err) {
  console.error("Gagal ekspor:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}