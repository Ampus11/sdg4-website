// GET /api/pesan-admin — daftar pesan kontak (khusus admin).
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT id, nama, surel, isi, dibuat_pada FROM pesan ORDER BY dibuat_pada DESC",
    );
    return NextResponse.json({
      pesan: rows.map((r) => ({
        ...r,
        dibuat_pada: r.dibuat_pada,
      })),
    });
  } catch (err) {
    console.error("Gagal memuat pesan:", err);
    return NextResponse.json({ error: "Database belum tersedia." }, { status: 503 });
  }
}