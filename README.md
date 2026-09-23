# SDG 4 Indonesia — Pendidikan Berkualitas untuk Semua

Situs komunitas tentang **Tujuan Pembangunan Berkelanjutan (SDG) ke-4: Quality Education**. Dibangun dengan **Next.js 16 (App Router)** dan **Tailwind CSS 4**, dengan desain editorial yang responsif, nyaman dibaca, dan ramah aksesibilitas.

## Konten Halaman

- **Beranda** — pesan inti SDG 4 & kutipan Ki Hajar Dewantara
- **Tentang** — penjelasan tujuan & tiga prinsip utama
- **Target** — sepuluh sasaran SDG 4 (4.1–4.c)
- **Aksi** — langkah nyata yang bisa dilakukan pembaca
- **Kontak** — formulir pesan (klien, validasi sederhana)

## Teknologi

| Bagian | Detail |
| ------ | ------ |
| Framework | Next.js 16 (Turbopack) |
| Styling | Tailwind CSS 4 (CSS-first config di `globals.css`) |
| Font | Geist (sans) & Fraunces (serif display) via `next/font` |
| Bahasa | Indonesia |

## Menjalankan di Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Build & Lint

```bash
npm run build
npm run lint
```

## Form Kontak (Backend + Database)

Pesan dari form **"Tulis surat untuk kami"** dikirim ke endpoint
`POST /api/kontak` lalu disimpan ke **PostgreSQL** (Vercel Storage / Neon /
Supabase). Kredensial database hanya hidup di sisi server.

1. Buat database di Vercel → Projek → **Storage** → **Create Database**
   (Vercel memprovisikan Neon Postgres).
2. Salin 1 variabel lingkungan: `DATABASE_URL` (atau `POSTGRES_URL`)
   → Settings → **Environment Variables** (Production, Preview, Development).
   Untuk pengembangan lokal, salin ke `.env.local`.
3. Jalankan skema tabel dari `db/schema.sql` di dashboard database
   (tab **Query**).
4. Putuskan re-deploy (Vercel CLI atau push ke `main`).

### Mengecek pesan masuk

- **Dashboard Vercel** → proyek → **Storage** → *Query*, lalu:
  ```sql
  SELECT * FROM pesan ORDER BY dibuat_pada DESC;
  ```
- Setiap pengiriman form juga terlihat di tab **Data**/**Rows** database.

### Struktur

```
src/
  app/
    globals.css      # Tema Tailwind (palet SDG 4)
    layout.tsx       # Metadata, font, layout dasar
    page.tsx         # Seluruh seksi halaman
    api/kontak/
      route.ts       # Endpoint backend: validasi + simpan ke database
  components/
    Header.tsx       # Navigasi (menu mobile responsif)
    Footer.tsx       # Kaki halaman
    ContactForm.tsx  # Form kontak (client) → POST /api/kontak
    Logo.tsx         # Emblem SDG 4
    icons.tsx        # Ikon SVG minimal
db/
  schema.sql         # Skema tabel "pesan"
.env.example         # Contoh variabel lingkungan yang dibutuhkan
```

> **Keamanan**: jangan taruh kredensial di kode klien atau commit ke Git.
> Semua kunci rahasia disimpan di Environment Variables Vercel dan
> dibaca via `process.env` di route handler (sisi server).