-- Skema database untuk form "Tulis surat untuk kami"
-- Jalankan di dashboard database (Vercel Storage → Query, atau psql/Neon).

CREATE TABLE IF NOT EXISTS pesan (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  surel TEXT NOT NULL,
  isi TEXT NOT NULL,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cek isi pesan (untuk verifikasi):
-- SELECT * FROM pesan ORDER BY dibuat_pada DESC;