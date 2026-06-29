"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function WatchPairClient() {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/watch/pair", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCode(data.code as string);
    } catch {
      setError("No se pudo generar el código. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 pb-12 pt-14">
      <div className="flex items-center gap-4 pb-6">
        <Link
          href="/"
          aria-label="Volver"
          className="flex h-11 w-11 items-center justify-center rounded-[13px] knit-surface text-[var(--muted-fg)] active:scale-95 transition"
        >
          <ChevronLeft />
        </Link>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
          Conectar Apple Watch
        </h1>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <Logo size={84} />

        {code ? (
          <>
            <p className="text-[15px] font-medium text-[var(--muted-fg)]">
              Escribí este código en el reloj
            </p>
            <div className="font-display text-6xl font-extrabold tracking-[0.18em] text-[var(--foreground)]">
              {code}
            </div>
            <p className="text-[13px] font-medium text-[var(--muted-fg)]">
              Vence en 10 minutos · de un solo uso
            </p>
            <button
              onClick={generate}
              disabled={loading}
              className="text-sm font-semibold text-[var(--color-primary)] active:scale-95 transition disabled:opacity-60"
            >
              {loading ? "Generando…" : "Generar otro"}
            </button>
          </>
        ) : (
          <>
            <p className="max-w-xs text-[15px] font-medium text-[var(--muted-fg)]">
              Abrí <b className="text-[var(--foreground)]">Knitk</b> en el reloj,
              tocá <b className="text-[var(--foreground)]">Conectar</b> y escribí
              el código que aparezca acá.
            </p>
            <button
              onClick={generate}
              disabled={loading}
              className="grad-primary flex h-[56px] items-center justify-center gap-2 rounded-[18px] px-8 text-[17px] font-bold text-[var(--color-on-primary)] shadow-float active:scale-95 transition disabled:opacity-60"
            >
              {loading ? "Generando…" : "Generar código"}
            </button>
          </>
        )}

        {error && (
          <p className="text-sm font-medium text-[var(--bad,#d33)]">{error}</p>
        )}
      </div>
    </main>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
