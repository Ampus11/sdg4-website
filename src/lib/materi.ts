// Bantuan (helpers) untuk modul materi: slug, validasi, daftar pilihan.

export const JENJANG = ["SD", "SMP", "SMA", "Kuliah", "Umum"] as const;

export const KATEGORI_PILIHAN = [
  "Matematika",
  "Sains",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "IPS / Sejarah",
  "Teknologi",
  "Keterampilan Belajar",
  "Karier",
  "Umum",
] as const;

export function buatSlug(judul: string): string {
  return judul
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export interface MateriInput {
  judul: string;
  ringkasan: string;
  jenjang: string;
  kategori: string;
  isi: string;
  file_url: string | null;
}

export function nilaiMateri(data: Record<string, unknown>): MateriInput {
  const bersih = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const judul = bersih(data.judul);
  const ringkasan = bersih(data.ringkasan);
  const jenjang = bersih(data.jenjang);
  const kategori = bersih(data.kategori);
  const isi = bersih(data.isi);
  const file_url = bersih(data.file_url) || null;

  if (judul.length < 3 || judul.length > 200) {
    throw new Error("Judul harus 3–200 karakter.");
  }
  if (!(JENJANG as readonly string[]).includes(jenjang)) {
    throw new Error("Jenjang harus salah satu: SD, SMP, SMA, Kuliah, Umum.");
  }
  if (kategori.length < 2 || kategori.length > 60) {
    throw new Error("Kategori harus diisi (2–60 karakter).");
  }
  if (ringkasan.length > 500) {
    throw new Error("Ringkasan maksimal 500 karakter.");
  }
  if (isi.length < 20) {
    throw new Error("Isi materi minimal 20 karakter.");
  }
  if (file_url && file_url.length > 500) {
    throw new Error("URL file terlalu panjang.");
  }

  return { judul, ringkasan, jenjang, kategori, isi, file_url };
}

/** Buat slug unik dengan memeriksa ke tabel. */
export async function slugUnik(
  pool: import("pg").Pool,
  judul: string,
  kecualiId?: number,
): Promise<string> {
  const dasar = buatSlug(judul) || `materi-${Date.now()}`;
  for (let i = 0; ; i++) {
    const calon = i === 0 ? dasar : `${dasar}-${i + 1}`;
    const { rows } = await pool.query(
      "SELECT 1 FROM materi WHERE slug = $1 AND id IS DISTINCT FROM $2 LIMIT 1",
      [calon, kecualiId ?? null],
    );
    if (rows.length === 0) return calon;
  }
}