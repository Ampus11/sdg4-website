import { Logo } from "@/components/Logo";

const links = [
  { href: "#tentang", label: "Tentang" },
  { href: "#target", label: "Target" },
  { href: "#aksi", label: "Aksi" },
  { href: "#kontak", label: "Kontak" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Catatan komunitas tentang pendidikan yang inklusif, adil, dan
            berkualitas — untuk semua orang, di mana pun.
          </p>
        </div>

        <nav aria-label="Tautan kaki" className="flex gap-10 sm:gap-14">
          <div>
            <p className="label-kicker">Jelajahi</p>
            <ul className="mt-4 space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="focusable text-sm text-ink-soft transition-colors hover:text-sdg-700"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-kicker">Sumber</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://sdgs.un.org/goals/goal4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focusable text-sm text-ink-soft transition-colors hover:text-sdg-700"
                >
                  sdgs.un.org
                </a>
              </li>
              <li>
                <a
                  href="https://sdgs.bappenas.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focusable text-sm text-ink-soft transition-colors hover:text-sdg-700"
                >
                  Bappenas — TPB
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 SDG 4 Indonesia. Ditulis dengan sepenuh hati.</p>
          <p>
            Materi edukasi — bukan afiliasi resmi PBB. Dibangun dengan Next.js
            &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}