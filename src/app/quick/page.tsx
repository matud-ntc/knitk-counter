"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Link from "next/link";

const STORAGE_KEY = "quick-counter-count";

export default function QuickCounterPage() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "theme-salmon";
    document.body.className = storedTheme;

    const color = getComputedStyle(document.body)
      .getPropertyValue("--color-primary")
      .trim();
    const metaTag = document.querySelector("meta[name='theme-color']");
    if (metaTag && color) metaTag.setAttribute("content", color);

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCount(parseInt(stored, 10) || 0);

    setMounted(true);
  }, []);

  const update = (next: number) => {
    setCount(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  if (!mounted) return null;

  return (
    <main className="flex flex-col min-h-screen px-4 pb-6 pt-8 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="text-[var(--color-primary)] text-sm underline"
        >
          ← Volver
        </Link>
        <h1 className="text-xl font-bold text-[var(--color-primary)]">
          Contador rápido
        </h1>
        <div className="w-16" />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center gap-8">
        <motion.span
          key={count}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="text-8xl font-bold text-[var(--color-foreground)] tabular-nums"
        >
          {count}
        </motion.span>

        <button
          onClick={() => update(count + 1)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 text-[var(--color-on-primary)] text-6xl w-40 h-40 rounded-full flex items-center justify-center shadow-lg transition-all select-none"
        >
          +
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-px bg-[var(--color-primary)]/25" />
          <div className="flex items-center gap-6">
            <button
              onClick={() => update(Math.max(0, count - 1))}
              className="bg-[var(--color-primary)]/12 hover:bg-[var(--color-primary)]/22 active:scale-95 text-[var(--color-primary)] text-2xl w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all select-none"
            >
              −
            </button>
            <Button
              variant="outline"
              circle
              title="Reiniciar"
              onClick={() => update(0)}
            >
              ↺
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
