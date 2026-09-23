// GET /api/sesi — status login admin (dipakai halaman /admin).
import { NextResponse } from "next/server";
import { adminEnabled, isAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ loggedIn: await isAdmin(), enabled: adminEnabled() });
}