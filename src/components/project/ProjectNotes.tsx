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
    <div className="w-full rounded-2xl knit-surface px-4 py-3 shadow-soft">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2"
      >
        <NoteIcon />
        <span className="text-[13px] font-semibold uppercase tracking-wide text-[var(--muted-fg)]">
          Notas de la sección
        </span>
        {hasNotes && !open && (
          <span className="ml-auto mr-2 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        )}
        <span className="ml-auto text-[13px] font-bold text-[var(--color-primary)]">
          {open ? "Cerrar" : hasNotes ? "Editar" : "Agregar"}
        </span>
      </button>

      {!open && hasNotes && (
        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-[var(--foreground)]/80">
          {value}
        </p>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="notes-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <textarea
                value={value}
                onChange={handleChange}
                placeholder="Cambié a aguja 4 mm en la fila 30…"
                className="min-h-[110px] w-full resize-none rounded-xl border-[1.5px] border-[var(--border-input)] bg-[var(--surface-2)] px-3 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted-fg)]/60 outline-none focus:border-[var(--color-primary)]"
                style={{ fontSize: "16px" }}
              />
              <div className="mt-1 h-4 text-right text-xs text-[var(--muted-fg)]">
                <AnimatePresence>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Guardado
                    </motion.span>
                  )}
                  {isPending && !saved && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Guardando…
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
