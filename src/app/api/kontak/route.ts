import { NextResponse } from "next/server";
import { Pool } from "pg";

/**
 * Endpoint POST /api/kontak
 * Menerima pesan dari form "Tulis surat untuk kami" dan menyimpannya
 * ke database PostgreSQL (Vercel/Neon/Supabase).
 *
 * Kredensial database hanya hidup di sisi server (process.env),
 * tidak pernah ter-expose ke browser.
 */

const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? null;

// Pool dibuat sekali per instance; aman untuk serverless.
const pool = connectionString
  ? new Pool({ connectionString, max: 3 })
  : null;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bersih(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

const PATTERN_SUREL = /^\S+@\S+\.\S+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Badan permintaan tidak valid." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;
  const nama = bersih(data.nama);
  const surel = bersih(data.surel);
  const pesan = bersih(data.pesan);

  if (nama.length < 2 || nama.length > 100) {
    return NextResponse.json(
      { error: "Nama harus diisi (2–100 karakter)." },
      { status: 400 },
    );
  }
  if (!PATTERN_SUREL.test(surel) || surel.length > 200) {
    return NextResponse.json(
      { error: "Format surel tidak valid." },
      { status: 400 },
    );
  }
  if (pesan.length < 10 || pesan.length > 5000) {
    return NextResponse.json(
      { error: "Pesan harus 10–5000 karakter." },
      { status: 400 },
    );
  }

  if (!pool) {
    return NextResponse.json(
      {
        error:
          "Database belum dikonfigurasi. Tambahkan DATABASE_URL di lingkungan Vercel.",
      },
      { status: 503 },
    );
  }

  try {
    await pool.query(
      "INSERT INTO pesan (nama, surel, isi) VALUES ($1, $2, $3)",
      [nama, surel, pesan],
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Gagal menyimpan pesan:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan pesan. Coba lagi nanti." },
      { status: 500 },
    );
  }
}