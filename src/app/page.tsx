import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { ArrowRightIcon, MailIcon } from "@/components/icons";

const prinsip = [
  {
    judul: "Akses untuk semua",
    isi: "Anak di kota maupun pelosok, penyandang disabilitas, dan kelompok yang selama ini tertinggal — semua berhak duduk di bangku yang sama.",
  },
  {
    judul: "Mutu yang sama rata",
    isi: "Guru yang terlatih, kurikulum yang relevan, dan lingkungan belajar yang aman bagi setiap anak, bukan hanya segelintir.",
  },
  {
    judul: "Belajar sepanjang hayat",
    isi: "Pendidikan tidak berhenti di ijazah. Keterampilan baru untuk terus tumbuh, di usia berapa pun.",
  },
];

const target = [
  {
    nomor: "4.1",
    judul: "Dasar yang merata untuk semua anak",
    isi: "Memastikan semua anak menyelesaikan pendidikan dasar dan menengah secara gratis, adil, dan berkualitas.",
  },
  {
    nomor: "4.2",
    judul: "Awal yang baik sejak dini",
    isi: "Akses terhadap pengasuhan dan pendidikan anak usia dini yang berkualitas, agar siap melangkah ke jenjang berikutnya.",
  },
  {
    nomor: "4.3",
    judul: "Jalur vokasi dan perguruan tinggi",
    isi: "Kesempatan yang setara atas pendidikan vokasi dan tinggi yang terjangkau bagi semua orang.",
  },
  {
    nomor: "4.4",
    judul: "Keterampilan yang dibutuhkan zaman",
    isi: "Meningkatkan jumlah pemuda dan orang dewasa yang menguasai keterampilan teknis dan kejuruan untuk bekerja maupun berwirausaha.",
  },
  {
    nomor: "4.5",
    judul: "Kesetaraan dan inklusi",
    isi: "Menghapus ketimpangan gender dalam pendidikan dan menjangkau penyandang disabilitas serta kelompok rentan.",
  },
  {
    nomor: "4.6",
    judul: "Literasi dan numerasi untuk semua",
    isi: "Semua remaja dan sebagian besar orang dewasa mampu membaca, menulis, dan berhitung dengan baik.",
  },
  {
    nomor: "4.7",
    judul: "Belajar tentang bumi dan sesama",
    isi: "Pendidikan untuk pembangunan berkelanjutan, hak asasi manusia, kesetaraan gender, dan budaya perdamaian.",
  },
  {
    nomor: "4.a",
    judul: "Sekolah yang aman dan ramah anak",
    isi: "Fasilitas belajar yang layak, inklusif, dan efektif — termasuk lingkungan yang aman dari kekerasan.",
  },
  {
    nomor: "4.b",
    judul: "Beasiswa yang menjangkau",
    isi: "Memperluas beasiswa bagi pelajar dari negara berkembang untuk pendidikan tinggi dan vokasi.",
  },
  {
    nomor: "4.c",
    judul: "Guru yang bermutu",
    isi: "Menambah pasokan guru berkualitas melalui pelatihan dan kerja sama internasional.",
  },
];

const aksi = [
  {
    judul: "Terus belajar",
    isi: "Ambil kursus daring, baca, bertanya, dan asah keterampilan baru. Pendidikan dimulai dari dirimu sendiri.",
  },
  {
    judul: "Bagikan yang kau tahu",
    isi: "Jadi tutor sebaya, relawan mengajar, atau sekadar menemani adik kelas belajar.",
  },
  {
    judul: "Raih yang tak terjangkau",
    isi: "Donasikan buku, dukung beasiswa, dan bantu anak yang jauh dari akses pendidikan.",
  },
  {
    judul: "Bicarakan dengan serius",
    isi: "Angkat isu pendidikan di lingkungan dan media sosialmu. Kesadaran adalah langkah pertama perubahan.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main id="konten" className="flex-1">
        {/* Beranda */}
        <section id="beranda" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:pb-24 lg:pt-28">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
              <div>
                <p className="label-kicker">
                  Tujuan Pembangunan Berkelanjutan · No. 4
                </p>
                <h1 className="mt-6 font-serif text-5xl leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                  Pendidikan adalah hak semua orang,{" "}
                  <em className="italic text-sdg-700">bukan keistimewaan.</em>
                </h1>
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
                  SDG 4 mengajak dunia memastikan pendidikan yang inklusif,
                  adil, dan berkualitas — untuk anak usia dini hingga pembelajar
                  sepanjang hayat. Ini catatan kami tentang apa yang sedang
                  diperjuangkan, dan apa yang bisa kamu mulai dari sekarang.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <a
                    href="#tentang"
                    className="focusable inline-flex items-center gap-2 rounded-md bg-sdg-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sdg-700"
                  >
                    Kenali SDG 4
                    <ArrowRightIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#aksi"
                    className="focusable text-sm font-medium text-ink underline decoration-sdg-300 decoration-2 underline-offset-4 transition-colors hover:text-sdg-700"
                  >
                    Lihat yang bisa kau lakukan
                  </a>
                </div>
              </div>

              <aside className="border-l-2 border-sdg-600 pl-6 sm:pl-8 lg:pl-10">
                <blockquote className="font-serif text-2xl italic leading-snug text-ink sm:text-[1.7rem]">
                  “Ing ngarso sung tuladho, ing madya mangun karso, tut wuri
                  handayani.”
                </blockquote>
                <p className="mt-4 text-sm text-ink-soft">
                  — Ki Hajar Dewantara, Bapak Pendidikan Indonesia
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* Fakta singkat */}
        <section aria-label="Fakta singkat SDG 4" className="border-b border-line">
          <dl className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
            <div className="py-6">
              <dt className="label-kicker">Sasaran</dt>
              <dd className="mt-2 font-serif text-4xl text-ink">10</dd>
              <dd className="mt-1 text-sm text-ink-soft">target nyata hingga 2030</dd>
            </div>
            <div className="py-6 sm:pl-8">
              <dt className="label-kicker">Komitmen</dt>
              <dd className="mt-2 font-serif text-4xl text-ink">193</dd>
              <dd className="mt-1 text-sm text-ink-soft">negara menyepakatinya</dd>
            </div>
            <div className="py-6 sm:pl-8">
              <dt className="label-kicker">Garis akhir</dt>
              <dd className="mt-2 font-serif text-4xl text-ink">2030</dd>
              <dd className="mt-1 text-sm text-ink-soft">kapan janji ini ditepati</dd>
            </div>
          </dl>
        </section>

        {/* Tentang */}
        <section id="tentang" className="scroll-mt-20 border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20 lg:py-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="label-kicker">01 — Tentang</p>
              <h2 className="mt-6 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                Pendidikan yang adil, seperti apa?
              </h2>
            </div>

            <div className="max-w-2xl">
              <p className="drop-cap text-xl leading-relaxed text-ink-soft">
                Sustainable Development Goal 4 — atau Tujuan Pembangunan
                Berkelanjutan ke-4 — adalah janji bersama untuk memastikan
                pendidikan yang inklusif dan merata, serta kesempatan belajar
                sepanjang hayat bagi semua orang. Bukan sekadar angka partisipasi
                sekolah, melainkan mutu yang sama rata: guru yang berdaya,
                kurikulum yang relevan, dan lingkungan belajar yang aman bagi
                setiap anak.
              </p>

              <blockquote className="mt-10 border-l-2 border-sdg-600 pl-5 font-serif text-xl italic leading-relaxed text-ink">
                “Memastikan pendidikan yang inklusif dan merata, serta
                meningkatkan kesempatan belajar sepanjang hayat untuk semua
                orang.”
              </blockquote>
              <p className="mt-4 text-sm text-ink-soft">
                — Perumusan resmi tujuan SDG 4 oleh Perserikatan Bangsa-Bangsa
              </p>

              <ol className="mt-12 space-y-8">
                {prinsip.map((p, i) => (
                  <li key={p.judul} className="grid gap-3 sm:grid-cols-[3rem_1fr]">
                    <span className="font-mono text-sm text-sdg-600">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl text-ink">{p.judul}</h3>
                      <p className="mt-1.5 leading-relaxed text-ink-soft">
                        {p.isi}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Target */}
        <section id="target" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 lg:pb-28 lg:pt-24">
            <div className="max-w-2xl">
              <p className="label-kicker">02 — Target</p>
              <h2 className="mt-6 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                Sepuluh sasaran, satu arah
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Setiap nomor di bawah ini adalah janji nyata yang harus ditepati
                pada tahun 2030 — dari ruang kelas di desa terpencil hingga
                kampus di kota besar.
              </p>
            </div>

            <ol className="mt-12">
              {target.map((t) => (
                <li
                  key={t.nomor}
                  className="grid gap-3 border-t border-line py-6 transition-colors hover:bg-[#f5f0e9] sm:grid-cols-[7rem_1fr] sm:gap-8 lg:py-7"
                >
                  <span className="font-mono text-base text-sdg-600">
                    {t.nomor}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-ink">{t.judul}</h3>
                    <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-soft">
                      {t.isi}
                    </p>
                  </div>
                </li>
              ))}
              <li className="border-t border-line" aria-hidden="true" />
            </ol>
          </div>
        </section>

        {/* Aksi */}
        <section id="aksi" className="scroll-mt-20 border-y border-line bg-mist">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20 lg:py-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="label-kicker">03 — Aksi</p>
              <h2 className="mt-6 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                Yang bisa kamu mulai dari sekarang
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Perubahan besar lahir dari langkah-langkah kecil. Pilih satu,
                lalu mulai.
              </p>
            </div>

            <ul className="border-y border-line">
              {aksi.map((a, i) => (
                <li
                  key={a.judul}
                  className="grid gap-2 border-b border-line py-7 last:border-b-0 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                >
                  <span className="font-mono text-sm text-sdg-600">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl text-ink">{a.judul}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">
                      {a.isi}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Kutipan */}
        <aside className="bg-sdg-600" aria-label="Kutipan">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
            <blockquote className="text-center font-serif text-2xl italic leading-snug text-sdg-50 sm:text-3xl lg:text-4xl">
              “Pendidikan adalah senjata paling ampuh yang dapat digunakan untuk
              mengubah dunia.”
            </blockquote>
            <p className="mt-8 text-center text-sm tracking-wide text-sdg-100">
              — Nelson Mandela
            </p>
          </div>
        </aside>

        {/* Kontak */}
        <section id="kontak" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20 lg:py-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="label-kicker">04 — Kontak</p>
              <h2 className="mt-6 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                Tulis surat untuk kami
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Mau terlibat, berbagi cerita, atau sekadar bertanya tentang SDG
                4? Pesanmu kami baca satu per satu.
              </p>

              <ul className="mt-8 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <MailIcon className="h-4 w-4 shrink-0 text-sdg-600" />
                  <a
                    href="mailto:halo@sdg4indonesia.id"
                    className="focusable text-ink-soft underline decoration-sdg-300 underline-offset-4 transition-colors hover:text-sdg-700"
                  >
                    halo@sdg4indonesia.id
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border-2 border-sdg-600"
                    aria-hidden="true"
                  />
                  Jakarta, Indonesia
                </li>
              </ul>
              <p className="mt-6 text-sm text-ink-soft">
                Setiap pesan dibalas dalam 2–3 hari kerja.
              </p>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}