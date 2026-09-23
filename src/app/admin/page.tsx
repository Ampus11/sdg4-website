"use client";

// /admin — Panel admin: login password, kelola materi (CRUD), lihat pesan masuk.
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

interface Materi {
  id: number;
  slug: string;
  judul: string;
  ringkasan: string;
  jenjang: string;
  kategori: string;
  isi: string;
  file_url: string | null;
  dibuat_pada: string;
}

interface Pesan {
  id: number;
  nama: string;
  surel: string;
  isi: string;
  dibuat_pada: string;
}

type Sesi = { loggedIn: boolean; enabled: boolean } | null;
const JENJANG = ["SD", "SMP", "SMA", "Kuliah", "Umum"];

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Terjadi kesalahan.");
  return data as T;
}

function formatTanggal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

export default function AdminPage() {
  const [sesi, setSesi] = useState<Sesi>(null);
  const [tab, setTab] = useState<"materi" | "pesan">("materi");

  useEffect(() => {
    api<{ loggedIn: boolean; enabled: boolean }>("/api/sesi")
      .then(setSesi)
      .catch(() => setSesi({ loggedIn: false, enabled: false }));
  }, []);

  if (!sesi) {
    return (
      <Shell>
        <p className="text-sm text-ink-soft">Memeriksa sesi…</p>
      </Shell>
    );
  }

  if (!sesi.enabled) {
    return (
      <Shell>
        <p className="text-sm text-ink-soft">
          Panel admin belum dikonfigurasi — set variabel ADMIN_PASSWORD di Vercel.
        </p>
      </Shell>
    );
  }

  if (!sesi.loggedIn) {
    return (
      <Shell>
        <LoginForm onSuccess={() => setSesi({ loggedIn: true, enabled: true })} />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sdg-600">
            Panel Admin
          </p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Kelola Perpustakaan</h1>
        </div>
        <button
          type="button"
          onClick={async () => {
            await api("/api/logout", { method: "POST" }).catch(() => {});
            setSesi({ loggedIn: false, enabled: true });
          }}
          className="focusable rounded-md border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:text-sdg-700"
        >
          Keluar
        </button>
      </div>

      <div className="mb-6 flex gap-2 border-b border-line pb-px">
        {(
          [
            ["materi", "Materi"],
            ["pesan", "Pesan masuk"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`focusable rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === k
                ? "border-b-2 border-sdg-600 text-ink"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "materi" ? <KelolaMateri /> : <DaftarPesan />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-8">
        <a href="/" className="focusable inline-block" aria-label="SDG 4 Indonesia">
          <Logo />
        </a>
      </div>
      {children}
    </main>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sibuk, setSibuk] = useState(false);

  async function masuk(e: React.FormEvent) {
    e.preventDefault();
    setSibuk(true);
    setError("");
    try {
      await api("/api/login", { method: "POST", body: JSON.stringify({ password }) });
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-line bg-paper p-6 sm:p-8">
      <h1 className="font-serif text-2xl text-ink">Masuk Admin</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Hanya untuk pengelola website SDG 4 Indonesia.
      </p>
      <form onSubmit={masuk} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focusable mt-1 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm font-medium text-sdg-600">{error}</p>}
        <button
          type="submit"
          disabled={sibuk}
          className="focusable w-full rounded-md bg-sdg-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sdg-700 disabled:opacity-60"
        >
          {sibuk ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}

function KelolaMateri() {
  const [daftar, setDaftar] = useState<Materi[] | null>(null);
  const [edit, setEdit] = useState<Materi | "baru" | null>(null);
  const [error, setError] = useState("");
  const [sibuk, setSibuk] = useState(true);

  const muat = useCallback(async () => {
    setSibuk(true);
    try {
      const data = await api<{ materi: Materi[] }>("/api/materi");
      setDaftar(data.materi);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSibuk(false);
    }
  }, []);

  useEffect(() => {
    void muat();
  }, [muat]);

  async function hapus(m: Materi) {
    if (!window.confirm(`Hapus materi “${m.judul}”?`)) return;
    try {
      await api(`/api/materi/${m.id}`, { method: "DELETE" });
      setDaftar((d) => d?.filter((x) => x.id !== m.id) ?? d);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setEdit("baru")}
          className="focusable rounded-md bg-sdg-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sdg-700"
        >
          + Tambah materi
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-sdg-100 p-3 text-sm text-sdg-800">{error}</p>
      )}

      {sibuk && !daftar ? (
        <p className="mt-6 text-sm text-ink-soft">Memuat…</p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-paper">
          {daftar?.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-base text-ink">{m.judul}</p>
                <p className="text-xs text-ink-soft">
                  {m.jenjang} · {m.kategori}
                  {m.file_url ? " · PDF" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/materi/${m.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="focusable text-sm text-ink-soft hover:text-sdg-700"
                >
                  Lihat
                </a>
                <button
                  type="button"
                  onClick={() => setEdit(m)}
                  className="focusable text-sm font-medium text-sdg-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void hapus(m)}
                  className="focusable text-sm text-ink-soft hover:text-sdg-700"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
          {daftar && daftar.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-ink-soft">
              Belum ada materi. Tambahkan yang pertama!
            </li>
          )}
        </ul>
      )}

      {edit && (
        <FormMateri
          nilai={edit === "baru" ? null : edit}
          onDone={() => {
            setEdit(null);
            void muat();
          }}
        />
      )}
    </div>
  );
}

function FormMateri({
  nilai,
  onDone,
}: {
  nilai: Materi | null;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    judul: nilai?.judul ?? "",
    jenjang: nilai?.jenjang ?? "Umum",
    kategori: nilai?.kategori ?? "Matematika",
    ringkasan: nilai?.ringkasan ?? "",
    isi: nilai?.isi ?? "",
    file_url: nilai?.file_url ?? "",
  });
  const [error, setError] = useState("");
  const [sibuk, setSibuk] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setSibuk(true);
    setError("");
    try {
      const body = {
        ...form,
        file_url: form.file_url.trim() || null,
        isi: form.isi.trim(),
      };
      if (nilai) {
        await api(`/api/materi/${nilai.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/api/materi", { method: "POST", body: JSON.stringify(body) });
      }
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSibuk(false);
    }
  }

  const inputCls =
    "focusable mt-1 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink";
  const labelCls = "block text-sm font-medium text-ink";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/30 p-4">
      <form
        onSubmit={simpan}
        className="my-8 w-full max-w-xl rounded-xl border border-line bg-paper p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink">
            {nilai ? "Edit materi" : "Tambah materi baru"}
          </h2>
          <button
            type="button"
            onClick={onDone}
            aria-label="Tutup formulir"
            className="focusable rounded-md px-2 py-1 text-lg text-ink-soft hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="f-judul" className={labelCls}>
              Judul
            </label>
            <input
              id="f-judul"
              required
              minLength={3}
              value={form.judul}
              onChange={(e) => set("judul", e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="f-jenjang" className={labelCls}>
                Jenjang
              </label>
              <select
                id="f-jenjang"
                value={form.jenjang}
                onChange={(e) => set("jenjang", e.target.value)}
                className={inputCls}
              >
                {JENJANG.map((j) => (
                  <option key={j}>{j}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-kategori" className={labelCls}>
                Kategori
              </label>
              <input
                id="f-kategori"
                required
                list="daftar-kategori"
                value={form.kategori}
                onChange={(e) => set("kategori", e.target.value)}
                className={inputCls}
              />
              <datalist id="daftar-kategori">
                {[
                  "Matematika",
                  "Sains",
                  "Bahasa Indonesia",
                  "Bahasa Inggris",
                  "IPS / Sejarah",
                  "Teknologi",
                  "Keterampilan Belajar",
                  "Karier",
                  "Umum",
                ].map((k) => (
                  <option key={k} value={k} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label htmlFor="f-ringkasan" className={labelCls}>
              Ringkasan (tampil di daftar)
            </label>
            <textarea
              id="f-ringkasan"
              rows={2}
              maxLength={500}
              value={form.ringkasan}
              onChange={(e) => set("ringkasan", e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="f-isi" className={labelCls}>
              Isi materi (pisahkan paragraf dengan baris kosong)
            </label>
            <textarea
              id="f-isi"
              required
              rows={8}
              value={form.isi}
              onChange={(e) => set("isi", e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="f-file" className={labelCls}>
              URL file / PDF (opsional)
            </label>
            <input
              id="f-file"
              value={form.file_url}
              onChange={(e) => set("file_url", e.target.value)}
              placeholder="/materi/nama-file.pdf atau https://…"
              className={inputCls}
            />
          </div>

          {error && <p className="text-sm font-medium text-sdg-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onDone}
              className="focusable rounded-md border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={sibuk}
              className="focusable rounded-md bg-sdg-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-sdg-700 disabled:opacity-60"
            >
              {sibuk ? "Menyimpan…" : nilai ? "Simpan perubahan" : "Tambahkan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function DaftarPesan() {
  const [pesan, setPesan] = useState<Pesan[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ pesan: Pesan[] }>("/api/pesan-admin")
      .then((d) => setPesan(d.pesan))
      .catch((err) => setError((err as Error).message));
  }, []);

  if (error) return <p className="text-sm text-sdg-600">{error}</p>;
  if (!pesan) return <p className="text-sm text-ink-soft">Memuat…</p>;

  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-paper">
      {pesan.map((p) => (
        <li key={p.id} className="px-4 py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium text-ink">{p.nama}</p>
            <p className="text-xs text-ink-soft">#{p.id} · {formatTanggal(p.dibuat_pada)}</p>
          </div>
          <p className="text-sm text-ink-soft">{p.surel}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">{p.isi}</p>
        </li>
      ))}
      {pesan.length === 0 && (
        <li className="px-4 py-8 text-center text-sm text-ink-soft">
          Belum ada pesan masuk.
        </li>
      )}
    </ul>
  );
}