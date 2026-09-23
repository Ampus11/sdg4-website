// POST /api/login — verifikasi password admin, lalu set cookie sesi (httpOnly).
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminEnabled,
  cookieOptions,
  issueToken,
} from "@/lib/auth";

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json(
      { error: "Halaman admin belum dikonfigurasi (ADMIN_PASSWORD kosong)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Badan permintaan tidak valid." }, { status: 400 });
  }

  const password = (body as Record<string, unknown>)?.password;
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password wajib diisi." }, { status: 400 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, issueToken(), cookieOptions());
  return res;
}