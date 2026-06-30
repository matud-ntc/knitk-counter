"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeSettingsModal from "@/components/ui/ThemeSettingsModal";
import ProgressBar from "@/components/ui/ProgressBar";
import { relativeDate } from "@/lib/relativeDate";

type ProjectCard = {
  id: string;
  name: string;
  isFinished: boolean;
  updatedAt: Date | string;
  sections: {
    totalRows: number | null;
    completedRows: number;
  }[];
};

type Props = {
  projects: ProjectCard[];
  showCompleted?: boolean;
};

function progressOf(p: ProjectCard) {
  const total = p.sections.reduce((acc, s) => acc + (s.totalRows ?? 0), 0);
  const completed = p.sections.reduce((acc, s) => acc + s.completedRows, 0);
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export default function ClientHome({ projects, showCompleted = false }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 pb-28 pt-[max(3.5rem,calc(env(safe-area-inset-top)_+_0.5rem))]">
      {/* ── Encabezado ─────────────────────────────────────────── */}
      {showCompleted ? (
        <div className="flex items-center gap-4 pb-5">
          <Link
            href="/"
            aria-label="Volver"
            className="flex h-11 w-11 items-center justify-center rounded-[13px] knit-surface text-[var(--muted-fg)] active:scale-95 transition"
          >
            <ChevronLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold leading-none text-[var(--foreground)]">
              Completados
            </h1>
            <p className="mt-1 text-[13px] font-medium text-[var(--muted-fg)]">
              {projects.length}{" "}
              {projects.length === 1 ? "proyecto terminado" : "proyectos terminados"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-end justify-between pb-4">
          <div>
            <p className="text-sm font-medium text-[var(--muted-fg)]">
              Hola de nuevo 🧶
            </p>
            <h1 className="text-[27px] font-extrabold leading-tight text-[var(--foreground)]">
              Mis proyectos
            </h1>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Ajustes"
            className="grad-counter flex h-11 w-11 items-center justify-center rounded-[14px] text-[var(--color-on-primary)] [box-shadow:0_6px_14px_rgba(var(--shadow-rgb),0.35)] active:scale-95 transition"
          >
            <GearIcon />
          </button>
        </div>
      )}

      {/* ── Navegación ─────────────────────────────────────────── */}
      {!showCompleted && (
        <div className="flex gap-2.5 pb-4">
          <Link
            href="/new"
            className="grad-primary flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-bold text-[var(--color-on-primary)] [box-shadow:0_6px_14px_rgba(var(--shadow-rgb),0.4)] active:scale-95 transition"
          >
            <span className="font-display text-lg leading-none">+</span> Nuevo
          </Link>
          <Link
            href="/finished"
            className="rounded-2xl knit-surface px-4 py-2.5 text-sm font-semibold text-[var(--muted-fg)] active:scale-95 transition"
          >
            Completados
          </Link>
          <Link
            href="/quick"
            className="rounded-2xl knit-surface px-4 py-2.5 text-sm font-semibold text-[var(--muted-fg)] active:scale-95 transition"
          >
            Rápido
          </Link>
        </div>
      )}

      {/* ── Lista de proyectos ─────────────────────────────────── */}
      {projects.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--chip-bg)] text-3xl">
            🧶
          </div>
          <p className="text-[15px] font-medium text-[var(--muted-fg)]">
            {showCompleted
              ? "Todavía no terminaste ningún proyecto."
              : "No tenés proyectos en progreso."}
          </p>
          {!showCompleted && (
            <Link
              href="/new"
              className="mt-1 text-sm font-bold text-[var(--color-primary)]"
            >
              Crear el primero →
            </Link>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {projects.map((project, i) => {
            const progress = progressOf(project);
            const initial = project.name.trim().charAt(0).toUpperCase() || "?";
            return (
              <motion.li
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Link href={`/project/${project.id}`}>
                  <div className="flex flex-col gap-2.5 rounded-[20px] knit-surface p-[15px] shadow-soft transition active:scale-95">
                    <div className="flex items-center justify-between">
                      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[var(--chip-bg)] text-lg font-bold text-[var(--chip-fg)]">
                        {initial}
                      </div>
                      {showCompleted ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)]">
                          <Check />
                        </span>
                      ) : (
                        <span className="text-[15px] font-bold text-[var(--color-primary)]">
                          {progress}%
                        </span>
                      )}
                    </div>
                    <div className="truncate text-[15px] font-semibold leading-tight text-[var(--foreground)]">
                      {project.name}
                    </div>
                    <ProgressBar value={showCompleted ? 100 : progress} height={8} />
                    <div className="flex justify-between text-[11px] font-medium text-[var(--muted-fg)]">
                      <span>
                        {project.sections.length}{" "}
                        {project.sections.length === 1 ? "sección" : "secciones"}
                      </span>
                      <span>
                        {showCompleted
                          ? "Terminado"
                          : relativeDate(project.updatedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      )}

      <ThemeSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 9h14M5 15h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
