"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { CloseIcon, MenuIcon } from "@/components/icons";

const links = [
  { href: "/#beranda", label: "Beranda" },
  { href: "/#tentang", label: "Tentang" },
  { href: "/materi", label: "Materi" },
  { href: "/#target", label: "Target" },
  { href: "/#aksi", label: "Aksi" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="/#beranda"
          aria-label="SDG 4 Indonesia — kembali ke beranda"
          className="focusable"
        >
          <Logo />
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navigasi utama"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focusable text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#kontak"
            className="focusable rounded-md bg-sdg-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sdg-700"
          >
            Kontak
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="focusable flex h-10 w-10 items-center justify-center text-ink md:hidden"
        >
          {open ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigasi menu ponsel"
          className="border-t border-line bg-paper px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="divide-y divide-line">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="focusable block py-3 text-base text-ink transition-colors hover:text-sdg-700"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/#kontak"
            onClick={() => setOpen(false)}
            className="focusable mt-4 block rounded-md bg-sdg-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-sdg-700"
          >
            Kontak
          </a>
        </nav>
      )}
    </header>
  );
}