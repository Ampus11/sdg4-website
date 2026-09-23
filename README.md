# SDG 4 Indonesia — Pendidikan Berkualitas untuk Semua

Situs komunitas tentang **Tujuan Pembangunan Berkelanjutan (SDG) ke-4: Quality Education**. Dibangun dengan **Next.js 16 (App Router)** dan **Tailwind CSS 4**, dengan desain editorial yang responsif, nyaman dibaca, dan ramah aksesibilitas.

## Konten Halaman

- **Beranda** — pesan inti SDG 4 & kutipan Ki Hajar Dewantara
- **Materi** (`/materi`) — perpustakaan materi belajar: daftar, pencarian,
  filter jenjang/kategori, halaman baca, dan unduh PDF
- **Admin** (`/admin`) — panel login: kelola materi (tambah/edit/hapus) + lihat
  pesan masuk
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
   (tab **Query**), atau otomatis lewat script:
   ```bash
   DATABASE_URL=... node scripts/setup-db.mjs
   ```
4. Putuskan re-deploy (Vercel CLI atau push ke `main`).

### Panel Admin dan Perpustakaan Materi

Website memiliki alur sistem dua arah:

- **Publik**: `GET /materi` (daftar + cari + filter) dan `GET /materi/[slug]`
  (baca + unduh PDF). Data langsung dirender dari database.
- **Admin**: `POST /api/login` (set cookie sesi httpOnly), lalu
  `POST /api/materi`, `PUT /api/materi/[id]`, `DELETE /api/materi/[id]`
  (kelola materi), dan `GET /api/pesan-admin` (lihat pesan).

Persiapan admin:

1. Set `ADMIN_PASSWORD` di Vercel → Settings → **Environment Variables**
   (Production, Preview, Development) — inilah password login `/admin`.
2. Isi tabel `materi` dengan contoh (sekali saja, jika masih kosong):
   ```bash
   DATABASE_URL=... node scripts/seed-materi.mjs
   ```
3. Opsional: buat ulang PDF sampel yang bisa diunduh:
   ```bash
   node scripts/make-pdfs.mjs    # hasil: public/materi/*.pdf
   ```
4. Deploy. Alur login → CRUD → tampil di publik berjalan otomatis.

### Mengecek pesan masuk

- **Dashboard Vercel** → proyek → **Storage** → *Query*, lalu:
  ```sql
  SELECT * FROM pesan ORDER BY dibuat_pada DESC;
  ```
- Setiap pengiriman form juga terlihat di tab **Data**/**Rows** database.
- Ekspor semua pesan ke CSV (dibuka dengan Excel):
  ```bash
  node scripts/export-pesan.mjs    # hasil: data/pesan.csv
  ```

### Notifikasi email (Gmail SMTP)

Saat ada pesan baru, selain tersimpan di database, notifikasi email dikirim ke
`lynxa4777@gmail.com` (ubah lewat env `NOTIF_EMAIL`) menggunakan **SMTP Gmail**
dengan *App Password* — tidak butuh akun/domain tambahan.

Persiapan sekali saja (pada akun Gmail penerima):

1. Nyalakan **2-Step Verification**: https://myaccount.google.com/security
2. Buat **App Password**: https://myaccount.google.com/apppasswords
   (nama bebas, mis. `sdg4-website`) → salin 16 karakter yang muncul.
3. Set env di Vercel → Settings → **Environment Variables**:
   - `SMTP_USER` = `lynxa4777@gmail.com`
   - `SMTP_APP_PASSWORD` = kode 16 karakter tadi
   - `NOTIF_EMAIL` = `lynxa4777@gmail.com`
4. Re-deploy. Alur email berjalan otomatis tanpa mengubah kode.

### Struktur

```
src/
  app/
    globals.css       # Tema Tailwind (palet SDG 4)
    layout.tsx        # Metadata, font, layout dasar
    page.tsx          # Beranda (landing editorial) + CTA Materi
    materi/
      page.tsx        # /materi — daftar + cari + filter (server-render)
      [slug]/page.tsx # /materi/[slug] — baca + unduh PDF
    admin/page.tsx    # /admin — login + kelola materi + lihat pesan
    api/
      kontak/route.ts        # POST — simpan pesan kontak + notif email
      login/route.ts         # POST — login admin (cookie httpOnly)
      logout/route.ts        # POST — logout admin
      sesi/route.ts          # GET — status login (dipakai /admin)
      pesan-admin/route.ts   # GET — daftar pesan (khusus admin)
      materi/route.ts        # GET publik + POST admin (tambah)
      materi/[id]/route.ts   # PUT/DELETE admin (edit & hapus)
  components/
    Header.tsx       # Navigasi (menu mobile responsif)
    Footer.tsx       # Kaki halaman (+ tautan admin halus)
    ContactForm.tsx  # Form kontak (client) → POST /api/kontak
    Logo.tsx         # Emblem SDG 4
    icons.tsx        # Ikon SVG minimal
  lib/
    db.ts            # Akses pool PostgreSQL (satu-satunya sumber)
    auth.ts          # Sesi cookie admin (HMAC)
    materi.ts        # Validasi & slug materi
public/materi/       # PDF materi sampel (dihasilkan scripts/make-pdfs.mjs)
db/
  schema.sql         # Skema tabel "pesan" + "materi"
scripts/
  setup-db.mjs       # Jalankan skema ke DATABASE_URL
  seed-materi.mjs    # Isi contoh materi (jika kosong)
  make-pdfs.mjs      # Generate PDF sampel → public/materi/
  export-pesan.mjs   # Ekspor pesan ke data/pesan.csv
.env.example         # Contoh variabel lingkungan yang dibutuhkan
```

> **Keamanan**: jangan taruh kredensial di kode klien atau commit ke Git.
> Semua kunci rahasia disimpan di Environment Variables Vercel dan
> dibaca via `process.env` di route handler (sisi server).