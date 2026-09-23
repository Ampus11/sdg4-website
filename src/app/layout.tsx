import type { Metadata, Viewport } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sdg4-indonesia.vercel.app"),
  title: {
    default: "SDG 4 — Pendidikan Berkualitas untuk Semua",
    template: "%s · SDG 4 Indonesia",
  },
  description:
    "Catatan komunitas tentang Tujuan Pembangunan Berkelanjutan ke-4: pendidikan yang inklusif, adil, dan berkualitas untuk semua orang.",
  openGraph: {
    title: "SDG 4 — Pendidikan Berkualitas untuk Semua",
    description:
      "Pendidikan adalah hak semua orang, bukan keistimewaan. Catatan komunitas tentang Tujuan Pembangunan Berkelanjutan ke-4.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c5192d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-sdg-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}