// GET /api/materi — daftar materi (publik, dengan filter opsional).
// POST /api/materi — tambah materi baru (khusus admin).
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { nilaiMateri, slugUnik } from "@/lib/materi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const jenjang = (searchParams.get("jenjang") ?? "").trim();
  const kategori = (searchParams.get("kategori") ?? "").trim();
  const admin = await isAdmin();

  try {
    const pool = getPool();
    const kondisi: string[] = [];
    const nilai: unknown[] = [];
    if (q) {
      kondisi.push(
        "(judul ILIKE $x OR ringkasan ILIKE $x OR isi ILIKE $x OR kategori ILIKE $x)",
      );
      nilai.push(`%${q}%`);
    }
    if (jenjang) {
      kondisi.push("jenjang = $x");
      nilai.push(jenjang);
    }
    if (kategori) {
      kondisi.push("kategori = $x");
      nilai.push(kategori);
    }
    const where = kondisi.length ? `WHERE ${kondisi.join(" AND ")}` : "";
    const sql = `SELECT id, slug, judul, ringkasan, jenjang, kategori, dibuat_pada
                 ${admin ? ", isi, file_url" : ""}
                 FROM materi ${where} ORDER BY dibuat_pada DESC`;
    const { rows } = await pool.query(sql, nilai);
    return NextResponse.json({ materi: rows });
  } catch (err) {
    console.error("Gagal memuat materi:", err);
    return NextResponse.json({ error: "Database belum tersedia." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Badan permintaan tidak valid." }, { status: 400 });
  }

  let input;
  try {
    input = nilaiMateri(body as Record<string, unknown>);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  try {
    const pool = getPool();
    const slug = await slugUnik(pool, input.judul);
    const { rows } = await pool.query(
      `INSERT INTO materi (slug, judul, ringkasan, jenjang, kategori, isi, file_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [slug, input.judul, input.ringkasan, input.jenjang, input.kategori, input.isi, input.file_url],
    );
    return NextResponse.json({ materi: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("Gagal menambah materi:", err);
    return NextResponse.json({ error: "Gagal menyimpan materi." }, { status: 500 });
  }
}