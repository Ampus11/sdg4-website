// Sesi admin sederhana berbasis cookie ber-Signature HMAC.
// Password admin tidak pernah dikirim ke klien; hanya dipakai untuk
// menandatangani token di dalam cookie httpOnly.
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sdg4_admin";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

export function adminEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

// Kunci HMAC diturunkan dari password — ganti password = semua sesi layu.
function key(): Buffer {
  return createHmac("sha256", "sdg4-admin-salt")
    .update(process.env.ADMIN_PASSWORD ?? "")
    .digest();
}

export function issueToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TTL_MS }),
  ).toString("base64url");
  const sig = createHmac("sha256", key()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", key())
    .update(payload)
    .digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  try {
    const { exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { exp?: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** Cek apakah pemanggil saat ini login sebagai admin. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: TTL_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  };
}