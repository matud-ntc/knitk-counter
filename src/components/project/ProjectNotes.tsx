"use client";

import { useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateSectionNotes } from "@/lib/actions/sectionActions";

type Props = {
  sectionId: string;
  revalidatePath: string;
  initialNotes: string;
};

export default function ProjectNotes({
  sectionId,
  revalidatePath,
  initialNotes,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setValue(next);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      startTransition(async () => {
        await updateSectionNotes(sectionId, next, revalidatePath);
        setSaved(true);
      });
    }, 800);
  };

  const hasNotes = value.trim().length > 0;

  return (
    <>
      {/* Barra compacta (siempre visible, anclada abajo) */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-2xl knit-surface px-4 py-3 text-left shadow-soft"
      >
        <NoteIcon />
        <span className="text-[13px] font-semibold uppercase tracking-wide text-[var(--muted-fg)]">
          Notas
        </span>
        {hasNotes && (
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--foreground)]/70">
            {value}
          </span>
        )}
        <span className="ml-auto shrink-0 text-[13px] font-bold text-[var(--color-primary)]">
          {hasNotes ? "Editar" : "Agregar"}
        </span>
      </button>

      {/* Bottom sheet al expandir */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl knit-surface px-5 pb-8 pt-4 shadow-float"
            >
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--border-soft)]" />
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--muted-fg)]">
                  <NoteIcon />
                  Notas de la sección
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] border border-[var(--border-soft)] text-[var(--muted-fg)] active:scale-95 transition"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <textarea
                autoFocus
                value={value}
                onChange={handleChange}
                placeholder="Cambié a aguja 4 mm en la fila 30…"
                className="min-h-[140px] w-full resize-none rounded-xl border-[1.5px] border-[var(--border-input)] bg-[var(--surface-2)] px-3 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted-fg)]/60 outline-none focus:border-[var(--color-primary)]"
                style={{ fontSize: "16px" }}
              />
              <div className="mt-1 h-4 text-right text-xs text-[var(--muted-fg)]">
                {saved ? "Guardado" : isPending ? "Guardando…" : ""}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NoteIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-[var(--muted-fg)]"
    >
      <path
        d="M5 4h14v16l-5-3-5 3V4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
