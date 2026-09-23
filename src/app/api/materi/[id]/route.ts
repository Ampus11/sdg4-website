// PUT /api/materi/[id] — perbarui materi (khusus admin).
// DELETE /api/materi/[id] — hapus materi (khusus admin).
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { nilaiMateri, slugUnik } from "@/lib/materi";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
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
    const slug = await slugUnik(pool, input.judul, idNum);
    const { rows } = await pool.query(
      `UPDATE materi SET slug=$1, judul=$2, ringkasan=$3, jenjang=$4, kategori=$5, isi=$6, file_url=$7
       WHERE id=$8 RETURNING *`,
      [slug, input.judul, input.ringkasan, input.jenjang, input.kategori, input.isi, input.file_url, idNum],
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Materi tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ materi: rows[0] });
  } catch (err) {
    console.error("Gagal memperbarui materi:", err);
    return NextResponse.json({ error: "Gagal menyimpan materi." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  try {
    const pool = getPool();
    const { rowCount } = await pool.query("DELETE FROM materi WHERE id=$1", [idNum]);
    if (!rowCount) {
      return NextResponse.json({ error: "Materi tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Gagal menghapus materi:", err);
    return NextResponse.json({ error: "Gagal menghapus materi." }, { status: 500 });
  }
}