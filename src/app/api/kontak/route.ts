import { NextResponse } from "next/server";
import { Pool } from "pg";
import nodemailer from "nodemailer";

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

    // Notifikasi email (opsional) — aktif saat SMTP_USER & SMTP_APP_PASSWORD diset.
    await kirimNotifikasi(nama, surel, pesan);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Gagal menyimpan pesan:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan pesan. Coba lagi nanti." },
      { status: 500 },
    );
  }
}

/** Escape konten HTML untuk mencegah injeksi dari isi pesan. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Kirim notifikasi email via SMTP (Gmail App Password) menggunakan nodemailer.
 * Gagal mengirim email tidak menggagalkan penyimpanan pesan.
 *
 * Env yang dibutuhkan: SMTP_USER, SMTP_APP_PASSWORD, NOTIF_EMAIL.
 * (Opsional: SMTP_HOST, SMTP_PORT — default smtp.gmail.com:465.)
 */
async function kirimNotifikasi(nama: string, surel: string, pesan: string) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_APP_PASSWORD;
  const notifEmail = process.env.NOTIF_EMAIL;
  if (!smtpUser || !smtpPass || !notifEmail) return;

  const waktu = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transporter.sendMail({
      from: `SDG 4 Indonesia <${smtpUser}>`,
      to: notifEmail,
      replyTo: surel,
      subject: `💌 Pesan baru dari ${nama}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f1c19;">
          <p style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #c5192d; margin: 0 0 12px;">SDG 4 Indonesia · Form Kontak</p>
          <h2 style="margin: 0 0 16px;">Ada pesan baru 📩</h2>
          <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b635a; width: 90px;">Nama</td>
              <td style="padding: 8px 0;"><strong>${esc(nama)}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b635a;">Surel</td>
              <td style="padding: 8px 0;"><strong>${esc(surel)}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b635a;">Waktu</td>
              <td style="padding: 8px 0;">${esc(waktu)}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f7f3ec; border-left: 3px solid #c5192d; border-radius: 4px; white-space: pre-wrap;">${esc(pesan)}</div>
          <p style="margin-top: 24px; font-size: 12px; color: #6b635a;">Balas langsung ke: <a href="mailto:${esc(surel)}">${esc(surel)}</a></p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Gagal kirim notifikasi email:", err);
  }
}