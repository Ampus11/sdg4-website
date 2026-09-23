"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckIcon } from "@/components/icons";

type Status = "idle" | "sending" | "done";

const inputClasses =
  "w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-sdg-600 focus:outline-none focus:ring-2 focus:ring-sdg-200";

export default function ContactForm() {
  const [nama, setNama] = useState("");
  const [surel, setSurel] = useState("");
  const [pesan, setPesan] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      nama.trim().length < 2 ||
      !/^\S+@\S+\.\S+$/.test(surel) ||
      pesan.trim().length < 10
    ) {
      setError("Pastikan nama terisi, surel valid, dan pesan lebih dari 10 karakter.");
      return;
    }
    setError(null);
    setStatus("sending");
    // Simulasi pengiriman — ganti dengan API/email service saat dihubungkan.
    window.setTimeout(() => setStatus("done"), 900);
  }

  if (status === "done") {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-4 rounded-lg border border-sdg-200 bg-sdg-50 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sdg-600 text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="font-serif text-2xl text-ink">Pesanmu terkirim.</h3>
        <p className="text-sm leading-relaxed text-ink-soft">
          Terima kasih sudah ikut bergerak. Kami akan membalas secepatnya —
          biasanya dalam 2–3 hari kerja.
        </p>
        <button
          type="button"
          onClick={() => {
            setNama("");
            setSurel("");
            setPesan("");
            setStatus("idle");
          }}
          className="focusable mt-2 text-sm font-medium text-sdg-700 underline decoration-sdg-300 underline-offset-4 transition-colors hover:text-sdg-600"
        >
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-ink">
            Nama
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            autoComplete="name"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama kamu"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="surel" className="mb-1.5 block text-sm font-medium text-ink">
            Surel
          </label>
          <input
            id="surel"
            name="surel"
            type="email"
            autoComplete="email"
            value={surel}
            onChange={(e) => setSurel(e.target.value)}
            placeholder="nama@contoh.id"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="pesan" className="mb-1.5 block text-sm font-medium text-ink">
          Pesan
        </label>
        <textarea
          id="pesan"
          name="pesan"
          rows={5}
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          placeholder="Ceritakan yang ingin kamu sampaikan…"
          className={`${inputClasses} resize-y`}
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-sdg-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="focusable mt-6 w-full rounded-md bg-sdg-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sdg-700 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Mengirim…" : "Kirim pesan"}
      </button>
    </form>
  );
}