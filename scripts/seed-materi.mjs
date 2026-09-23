// Mengisi tabel "materi" dengan contoh materi belajar (hanya jika masih kosong).
// Jalankan:  node scripts/seed-materi.mjs   (dengan DATABASE_URL diset)
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL belum diset.");
  process.exit(1);
}

const pool = new Pool({ connectionString });

const MATERI = [
  {
    slug: "pecahan-dan-desimal",
    judul: "Pecahan dan Desimal: Dasar Matematika",
    ringkasan:
      "Konsep pecahan dan desimal yang dekat dengan kehidupan sehari-hari, lengkap dengan contoh dan latihan soal.",
    jenjang: "SD",
    kategori: "Matematika",
    file_url: "/materi/pecahan-dan-desimal.pdf",
    isi: [
      "Pecahan adalah cara menyatakan bagian dari keseluruhan. Contohnya, jika sebuah kue dibagi menjadi 2 bagian sama besar, maka satu bagian ditulis sebagai 1/2 (satu per dua).",
      "Desimal adalah cara lain menuliskan pecahan menggunakan tanda koma. Pecahan 1/2 setara dengan 0,5; 1/4 setara dengan 0,25; dan 3/4 setara dengan 0,75.",
      "Untuk mengubah pecahan menjadi desimal, bagilah pembilang dengan penyebut. Misalnya 1/2 = 1 : 2 = 0,5.",
      "Untuk membandingkan dua bilangan desimal, bandingkan angka dari paling kiri (nilai tempat terbesar). Contoh: 0,75 lebih besar dari 0,5 karena 7 > 5.",
      "Latihan: Urutkan bilangan-bilangan ini dari yang terbesar — 0,25 ; 0,5 ; 0,125 ; 0,75. Jawaban: 0,75 ; 0,5 ; 0,25 ; 0,125.",
      "Materi lengkap tersedia dalam bentuk PDF yang bisa diunduh pada halaman ini.",
    ].join("\n\n"),
  },
  {
    slug: "paragraf-argumentasi",
    judul: "Menulis Paragraf Argumentasi",
    ringkasan:
      "Panduan menulis paragraf argumentasi yang kuat: struktur, ciri-ciri, dan contoh langsung.",
    jenjang: "SMP",
    kategori: "Bahasa Indonesia",
    file_url: "/materi/paragraf-argumentasi.pdf",
    isi: [
      "Paragraf argumentasi adalah paragraf yang berisi pendapat atau gagasan penulis yang disertai alasan, bukti, dan contoh agar pembaca yakin.",
      "Struktur umumnya terdiri dari tiga bagian: (1) pernyataan pendapat, (2) penjelasan dan bukti pendukung, serta (3) simpulan yang menegaskan kembali pendapat.",
      "Agar argumentasi kuat, gunakan data, fakta, hasil penelitian, atau contoh konkret. Hindari pendapat tanpa dasar yang bisa diuji kebenarannya.",
      "Contoh: 'Pendidikan berkualitas adalah hak setiap anak, termasuk anak di daerah terpencil. Oleh karena itu, pemerintah dan masyarakat harus bergotong royong menyediakan akses belajar yang setara.'",
      "Tugas latihan: tulis satu paragraf argumentasi tentang pentingnya wajib belajar 12 tahun, lengkap dengan bukti singkat dan simpulan.",
    ].join("\n\n"),
  },
  {
    slug: "sistem-pernapasan",
    judul: "Sistem Pernapasan Manusia",
    ringkasan:
      "Memahami organ-organ pernapasan manusia (hidung sampai alveolus) dan cara kerjanya secara sederhana.",
    jenjang: "SMP",
    kategori: "Sains",
    isi: [
      "Sistem pernapasan manusia berfungsi mengambil oksigen (O2) dari udara dan melepaskan karbon dioksida (CO2).",
      "Jalurnya: hidung → faring → laring → trakea → bronkus → bronkiolus → alveolus. Di dalam alveolus terjadi pertukaran gas antara udara dan darah.",
      "Dua fase utama pernapasan adalah inspirasi (menghirup) dan ekspirasi (menghembuskan). Saat inspirasi, diafragma mengerut dan rongga dada membesar sehingga udara masuk.",
      "Menjaga kesehatan pernapasan dapat dilakukan dengan olahraga teratur, menghindari asap rokok dan polusi, serta menjaga kebersihan lingkungan.",
      "Tugas rumah: gambar jalur pernapasan manusia dan beri keterangan tiap organ secara singkat.",
    ].join("\n\n"),
  },
  {
    slug: "aljabar-dasar",
    judul: "Aljabar Dasar untuk Pemula",
    ringkasan:
      "Pengenalan variabel, suku sejenis, dan cara menyelesaikan persamaan linear sederhana.",
    jenjang: "SMA",
    kategori: "Matematika",
    isi: [
      "Aljabar menggunakan huruf (variabel) untuk mewakili besaran yang belum diketahui. Contoh: dalam 2x + 3 = 11, x adalah variabel.",
      "Menjumlahkan suku sejenis: 2x + 3x = 5x. Suku sejenis adalah suku yang variabelnya sama, misalnya 2x dan 3x.",
      "Menyelesaikan persamaan linear satu variabel dilakukan dengan mengisolasi variabel. Untuk 2x + 3 = 11: kurangi kedua ruas dengan 3 menjadi 2x = 8, lalu bagi kedua ruas dengan 2 sehingga x = 4.",
      "Langkah penting: operasi yang dilakukan di ruas kiri wajib dilakukan juga di ruas kanan agar persamaan tetap setara.",
      "Latihan: selesaikan 3y − 5 = 10. Jawaban: y = 5.",
    ].join("\n\n"),
  },
  {
    slug: "tenses-simple-present",
    judul: "English Grammar: Simple Present Tense",
    ringkasan:
      "Kapan dan bagaimana memakai Simple Present Tense, termasuk aturan -s/-es untuk orang ketiga tunggal.",
    jenjang: "Kuliah",
    kategori: "Bahasa Inggris",
    isi: [
      "Simple Present Tense dipakai untuk kebiasaan, fakta umum, dan jadwal tetap. Contoh: 'The sun rises in the east.' (fakta) dan 'I study every night.' (kebiasaan).",
      "Pola untuk subjek I/you/we/they: Verb1 tanpa tambahan. Pola untuk he/she/it: Verb1 + s/es. Contoh: 'She reads a book every day.'",
      "Verba yang berakhiran s, sh, ch, x, o mendapat akhiran es: watch → watches; go → goes.",
      "Bentuk negatif memakai do not (jangan; don't) atau does not (doesn't): 'He doesn't like coffee.' Bentuk tanya: 'Do you study here?' / 'Does she play piano?'",
      "Latihan: ubah kalimat 'They play football' menjadi bentuk yang benar untuk subjek 'She'.",
    ].join("\n\n"),
  },
  {
    slug: "belajar-efektif-digital",
    judul: "Belajar Efektif di Era Digital",
    ringkasan:
      "Tips praktis belajar online yang fokus dan efisien: teknik Pomodoro, manajemen gangguan, dan mencatat.",
    jenjang: "Umum",
    kategori: "Keterampilan Belajar",
    file_url: "/materi/belajar-efektif-digital.pdf",
    isi: [
      "Belajar di era digital menuntut kemampuan mengelola perhatian. Teknik Pomodoro — belajar 25 menit lalu istirahat 5 menit — terbukti membantu menjaga fokus.",
      "Kurangi gangguan: matikan notifikasi aplikasi, letakkan ponsel di luar jangkauan saat sesi belajar, dan siapkan ruang yang nyaman serta pencahayaan cukup.",
      "Catat poin-poin penting dengan bahasa sendiri, lalu uji pemahamanmu dengan menjelaskan kembali topik itu kepada orang lain (teknik Feynman).",
      "Gunakan sumber belajar digital gratis secara bijak: video edukasi, buku digital, dan platform latihan soal. Pastikan sumbernya kredibel.",
      "Rencanakan waktu: tetapkan target kecil harian agar belajar lebih terarah dan tidak menumpuk menjelang ujian.",
    ].join("\n\n"),
  },
];

try {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM materi");
  if (rows[0].n > 0) {
    console.log(`Materi sudah terisi (${rows[0].n} baris). Tidak menambah apa pun.`);
  } else {
    for (const m of MATERI) {
      await pool.query(
        `INSERT INTO materi (slug, judul, ringkasan, jenjang, kategori, isi, file_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [m.slug, m.judul, m.ringkasan, m.jenjang, m.kategori, m.isi, m.file_url ?? null],
      );
    }
    console.log(`Seeder selesai: ${MATERI.length} materi dimasukkan.`);
  }
} catch (err) {
  console.error("Gagal seed materi:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}