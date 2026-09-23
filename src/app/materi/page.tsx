// /materi — Perpustakaan Materi (publik). Dirender per-permintaan dari database.
import Link from "next/link";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

const JENJANG = ["SD", "SMP", "SMA", "Kuliah", "Umum"];

function ringkasGenap(v: string, max = 140): string {
  const s = v.trim();
  if (s.length <= max) return s;
  const potong = s.slice(0, max);
  const spasi = potong.lastIndexOf(" ");
  return (spasi > 60 ? potong.slice(0, spasi) : potong).trimEnd() + "…";
}

function formatTanggal(iso: Date): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

export default async function MateriPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; jenjang?: string; kategori?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const jenjang = (params.jenjang ?? "").trim();
  const kategori = (params.kategori ?? "").trim();

  let rows: Array<Record<string, unknown>> = [];
  let kategoriOptions: string[] = [];
  try {
    const pool = getPool();
    const kondisi: string[] = [];
    const nilai: unknown[] = [];
    let i = 1;
    if (q) {
      kondisi.push(
        `(judul ILIKE $${i} OR ringkasan ILIKE $${i} OR isi ILIKE $${i} OR kategori ILIKE $${i})`,
      );
      nilai.push(`%${q}%`);
      i++;
    }
    if (jenjang) {
      kondisi.push(`jenjang = $${i}`);
      nilai.push(jenjang);
      i++;
    }
    if (kategori) {
      kondisi.push(`kategori = $${i}`);
      nilai.push(kategori);
      i++;
    }
    const where = kondisi.length ? `WHERE ${kondisi.join(" AND ")}` : "";
    const sql = `SELECT id, slug, judul, ringkasan, jenjang, kategori, dibuat_pada
                 FROM materi ${where} ORDER BY dibuat_pada DESC`;
    const [daftar, dist] = await Promise.all([
      pool.query(sql, nilai),
      pool.query("SELECT DISTINCT kategori FROM materi ORDER BY kategori"),
    ]);
    rows = daftar.rows;
    kategoriOptions = dist.rows.map((r: { kategori: string }) => r.kategori);
  } catch (err) {
    console.error("Gagal memuat materi:", err);
  }

  const terfilter = Boolean(q || jenjang || kategori);
  const jumlah = rows.length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Kepala halaman */}
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sdg-600">
          Tujuan 4 · Pendidikan Berkualitas
        </p>
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Perpustakaan Materi
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          Modul dan bahan belajar gratis yang bisa dibaca langsung atau diunduh.
          Dari SD sampai jenjang umum — belajar seharusnya untuk semua.
        </p>
      </header>

      {/* Filter */}
      <form
        method="get"
        className="mt-10 grid gap-3 rounded-lg border border-line bg-mist p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:p-5"
        aria-label="Filter materi"
      >
        <label className="sr-only" htmlFor="cari">
          Cari materi
        </label>
        <input
          id="cari"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Cari judul atau topik…"
          className="focusable rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60"
        />
        <select
          name="jenjang"
          defaultValue={jenjang}
          aria-label="Filter jenjang"
          className="focusable rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink"
        >
          <option value="">Semua jenjang</option>
          {JENJANG.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
        <select
          name="kategori"
          defaultValue={kategori}
          aria-label="Filter kategori"
          className="focusable rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink"
        >
          <option value="">Semua kategori</option>
          {kategoriOptions.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="focusable rounded-md bg-sdg-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sdg-700"
        >
          Cari
        </button>
      </form>

      {/* Hasil */}
      <p className="mt-8 text-sm text-ink-soft">
        {jumlah} materi ditemukan
        {terfilter && (
          <a href="/materi" className="focusable ml-3 text-sdg-600 hover:underline">
            Tampilkan semua
          </a>
        )}
      </p>

      {jumlah === 0 && (
        <div className="mt-6 rounded-lg border border-line bg-mist p-10 text-center">
          <p className="font-serif text-xl text-ink">Tidak ada materi yang cocok.</p>
          <p className="mt-2 text-sm text-ink-soft">
            Coba ubah kata kunci atau filter, atau ajukan materi yang kamu butuhkan lewat
            form kontak.
          </p>
        </div>
      )}

      <ul className="mt-6 grid gap-5 sm:grid-cols-2">
        {rows.map((m) => (
          <li key={m.id as number}>
            <Link
              href={`/materi/${m.slug as string}`}
              className="focusable group flex h-full flex-col rounded-lg border border-line bg-paper p-6 transition-colors hover:border-sdg-300"
            >
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sdg-100 px-2.5 py-0.5 text-xs font-medium text-sdg-800">
                  {m.jenjang as string}
                </span>
                <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-ink-soft">
                  {m.kategori as string}
                </span>
              </div>
              <h2 className="mt-3 font-serif text-xl leading-snug text-ink transition-colors group-hover:text-sdg-700">
                {m.judul as string}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                {ringkasGenap(m.ringkasan as string)}
              </p>
              <p className="mt-4 text-xs text-ink-soft/70">
                {formatTanggal(m.dibuat_pada as Date)} · Baca selengkapnya →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}