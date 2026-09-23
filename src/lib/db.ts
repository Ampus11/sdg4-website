// Akses database terpusat (Pool dibuat sekali, aman untuk serverless).
import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL belum diset. Tambahkan di Vercel → Settings → Environment Variables.",
      );
    }
    pool = new Pool({ connectionString, max: 3 });
  }
  return pool;
}