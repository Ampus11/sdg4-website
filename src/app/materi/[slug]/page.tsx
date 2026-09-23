// /materi/[slug] — halaman baca + unduh materi (publik).
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatTanggal(iso: Date): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

export default async function MateriDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let materi: Record<string, unknown> | null = null;
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT id, slug, judul, ringkasan, jenjang, kategori, isi, file_url, dibuat_pada FROM materi WHERE slug=$1",
      [slug],
    );
    materi = rows[0] ?? null;
  } catch (err) {
    console.error("Gagal memuat materi:", err);
  }

  if (!materi) notFound();

  const paragraf = String(materi.isi ?? "")
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Link
        href="/materi"
        className="focusable text-sm text-sdg-600 hover:underline"
      >
        ← Kembali ke Perpustakaan Materi
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-sdg-100 px-2.5 py-0.5 text-xs font-medium text-sdg-800">
          {materi.jenjang as string}
        </span>
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-ink-soft">
          {materi.kategori as string}
        </span>
      </div>

      <h1 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
        {materi.judul as string}
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        Diunggah {formatTanggal(materi.dibuat_pada as Date)}
      </p>
      {materi.ringkasan ? (
        <p className="mt-4 border-l-2 border-sdg-600 pl-4 text-base italic leading-relaxed text-ink-soft">
          {materi.ringkasan as string}
        </p>
      ) : null}

      <article className="mt-8 space-y-5 text-base leading-relaxed text-ink">
        {paragraf.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      {materi.file_url ? (
        <div className="mt-10 rounded-lg border border-line bg-mist p-5">
          <p className="text-sm font-medium text-ink">Materi versi unduhan</p>
          <p className="mt-1 text-sm text-ink-soft">
            Simpan PDF-nya untuk belajar offline, kapan pun dan di mana pun.
          </p>
          <a
            href={materi.file_url as string}
            download
            className="focusable mt-4 inline-block rounded-md bg-sdg-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sdg-700"
          >
            Unduh Materi (PDF) ↓
          </a>
        </div>
      ) : null}

      <section className="mt-12 rounded-lg border border-line bg-paper p-6">
        <h2 className="font-serif text-xl text-ink">Butuh materi lain?</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Sampaikan topik atau pelajaran yang kamu butuhkan lewat form kontak.
          Tim kami akan berbagi sebanyak mungkin untuk semua.
        </p>
        <Link
          href="/#kontak"
          className="focusable mt-4 inline-block text-sm font-medium text-sdg-600 hover:underline"
        >
          Tulis surat untuk kami →
        </Link>
      </section>
    </main>
  );
}