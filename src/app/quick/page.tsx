"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BigNumber,
  PlusButton,
  RoundControl,
  MinusGlyph,
} from "@/components/ui/CounterParts";
import { haptic, tick, useCounterSettings, useWakeLock } from "@/lib/clientSettings";

const STORAGE_KEY = "quick-counter-count";

export default function QuickCounterPage() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [settings] = useCounterSettings();
  useWakeLock(settings.keepAwake);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCount(parseInt(stored, 10) || 0);
    setMounted(true);
  }, []);

  const update = (next: number) => {
    const v = Math.max(0, next);
    setCount(v);
    localStorage.setItem(STORAGE_KEY, String(v));
  };

  if (!mounted) return null;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-[max(3.5rem,calc(env(safe-area-inset-top)_+_0.5rem))]">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Cerrar"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] knit-surface text-[var(--muted-fg)] active:scale-95 transition"
        >
          <CloseIcon />
        </Link>
        <h1 className="text-[17px] font-bold text-[var(--foreground)]">
          Contador rápido
        </h1>
        <div className="w-[42px]" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted-fg)]">
          Filas
        </span>
        <BigNumber
          value={count}
          className="text-[148px] leading-[0.86] text-[var(--foreground)]"
        />
      </div>

      <div className="mb-4 flex justify-center">
        <PlusButton
          onAdd={() => {
            haptic();
            tick();
            update(count + 1);
          }}
          size={158}
          plusSize={88}
        />
      </div>

      <div className="flex justify-center gap-3.5 pb-6">
        <RoundControl
          onClick={() => update(count - 1)}
          ariaLabel="Restar fila"
          size={66}
        >
          <MinusGlyph />
        </RoundControl>
        <button
          className="flex h-[66px] items-center gap-2.5 rounded-[20px] knit-surface px-6 font-semibold text-[var(--muted-fg)] shadow-soft active:scale-95 transition"
          onClick={() => update(0)}
        >
          <ResetRing />
          Reiniciar
        </button>
      </div>
    </main>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ResetRing() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 1 0 2.3-5.6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M4 4v4h4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
