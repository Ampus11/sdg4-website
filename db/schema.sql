-- Skema database untuk SDG 4 Indonesia
-- Jalankan di dashboard database (Vercel Storage → Query, atau psql/Neon),
-- atau otomatis: DATABASE_URL=... node scripts/setup-db.mjs

-- 1) Tabel pesan kontak ("Tulis surat untuk kami")
CREATE TABLE IF NOT EXISTS pesan (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  surel TEXT NOT NULL,
  isi TEXT NOT NULL,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Tabel materi belajar (Perpustakaan Materi)
CREATE TABLE IF NOT EXISTS materi (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL DEFAULT '',
  jenjang TEXT NOT NULL DEFAULT 'Umum',              -- SD / SMP / SMA / Kuliah / Umum
  kategori TEXT NOT NULL DEFAULT 'Umum',             -- Matematika, Sains, Bahasa, dst.
  isi TEXT NOT NULL DEFAULT '',
  file_url TEXT,                                     -- opsional: link PDF/materi
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_materi_jenjang ON materi (jenjang);
CREATE INDEX IF NOT EXISTS idx_materi_kategori ON materi (kategori);

-- Cek isi pesan (untuk verifikasi):
-- SELECT * FROM pesan ORDER BY dibuat_pada DESC;
-- SELECT id, slug, judul, jenjang, kategori FROM materi ORDER BY dibuat_pada DESC;