// Menghasilkan PDF materi sampel ke public/materi/ untuk fitur unduh.
// PDF dibuat deterministik (xref dihitung) sehingga valid untuk semua viewer.
// Jalankan:  node scripts/make-pdfs.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const PDFS = [
  {
    slug: "pecahan-dan-desimal",
    judul: "Pecahan dan Desimal",
    sub: "Matematika · SD",
    lines: [
      "PECAHAN DAN DESIMAL",
      "",
      "Materi: Pecahan dan Desimal · Jenjang SD",
      "",
      "1. Pecahan adalah bagian dari keseluruhan, contoh 1/2 bagian kue.",
      "2. Pecahan dapat diubah ke desimal dengan membagi pembilang dengan",
      "   penyebut, misal 1/2 = 0,5 dan 3/4 = 0,75.",
      "3. Untuk membandingkan desimal, bandingkan dari angka paling kiri.",
      "",
      "Latihan: Urutkan dari yang terbesar: 0,25 ; 0,5 ; 0,125 ; 0,75.",
      "",
      "Sumber: Perpustakaan Materi SDG 4 — sdg4-website.vercel.app",
    ],
  },
  {
    slug: "paragraf-argumentasi",
    judul: "Menulis Paragraf Argumentasi",
    sub: "Bahasa Indonesia · SMP",
    lines: [
      "MENULIS PARAGRAF ARGUMENTASI",
      "",
      "Materi: Bahasa Indonesia · Jenjang SMP",
      "",
      "1. Paragraf argumentasi berisi pendapat disertai alasan dan bukti.",
      "2. Struktur: pernyataan pendapat, penjelasan, dan kesimpulan.",
      "3. Gunakan data, fakta, atau contoh untuk memperkuat pendapat.",
      "",
      "Contoh topik: 'Wajib belajar 12 tahun harus didukung semua pihak'.",
      "",
      "Sumber: Perpustakaan Materi SDG 4 — sdg4-website.vercel.app",
    ],
  },
  {
    slug: "belajar-efektif-digital",
    judul: "Belajar Efektif di Era Digital",
    sub: "Keterampilan Belajar · Umum",
    lines: [
      "BELAJAR EFEKTIF DI ERA DIGITAL",
      "",
      "Materi: Keterampilan Belajar · Jenjang Umum",
      "",
      "1. Gunakan teknik Pomodoro: 25 menit fokus, 5 menit istirahat.",
      "2. Kurangi notifikasi saat belajar agar perhatian tidak terpecah.",
      "3. Catat poin penting, lalu uji pemahaman dengan menjelaskan ulang.",
      "4. Manfaatkan sumber belajar digital gratis secara bijak.",
      "",
      "Sumber: Perpustakaan Materi SDG 4 — sdg4-website.vercel.app",
    ],
  },
];

/** Escaping karakter khusus di string PDF. */
const escPdf = (s) =>
  s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

function buildPdf({ lines }) {
  const content =
    lines.map((l, i) => `(${escPdf(l)}) Tj ${i < lines.length - 1 ? "0 -22 Td" : ""}`).join("\n");

  const stream =
    `BT /F1 14 Tf 50 790 Td\n${content}\nET`.replace(/\n/g, "\n");

  const parts = [];
  const offsets = [];
  let off = 0;
  const push = (s) => {
    const b = Buffer.from(s, "latin1");
    parts.push(b);
    off += b.length;
  };
  const obj = (n, body) => {
    offsets[n] = off;
    push(`${n} 0 obj\n${body}\nendobj\n`);
  };

  push("%PDF-1.4\n");
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(
    3,
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  );
  obj(4, `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`);
  obj(5, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const xrefStart = off;
  let xref = `xref\n0 6\n`;
  for (let i = 0; i < 6; i++) {
    if (i === 0) xref += "0000000000 65535 f \n";
    else xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return Buffer.concat([...parts, Buffer.from(xref, "latin1")]);
}

mkdirSync("public/materi", { recursive: true });
for (const p of PDFS) {
  const path = `public/materi/${p.slug}.pdf`;
  writeFileSync(path, buildPdf(p));
  console.log(`PDF dibuat: ${path}`);
}