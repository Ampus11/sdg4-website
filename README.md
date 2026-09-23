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

## Struktur

```
src/
  app/
    globals.css      # Tema Tailwind (palet SDG 4)
    layout.tsx       # Metadata, font, layout dasar
    page.tsx         # Seluruh seksi halaman
  components/
    Header.tsx       # Navigasi (menu mobile responsif)
    Footer.tsx       # Kaki halaman
    ContactForm.tsx  # Form kontak (client)
    Logo.tsx         # Emblem SDG 4
    icons.tsx        # Ikon SVG minimal
```

## Deploy

Proyek terhubung ke **Vercel** menggunakan Vercel CLI:

```bash
vercel --prod --yes
```