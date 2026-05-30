"use client";

import { useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProjectNotes } from "@/lib/actions/projectActions";

type Props = {
  projectId: string;
  initialNotes: string;
};

export default function ProjectNotes({ projectId, initialNotes }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      startTransition(async () => {
        await updateProjectNotes(projectId, e.target.value);
        setSaved(true);
      });
    }, 800);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] transition w-full"
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          ›
        </motion.span>
        Notas
        {value.trim().length > 0 && !open && (
          <span className="ml-auto w-2 h-2 rounded-full bg-[var(--color-primary)] opacity-70" />
        )}
      </button>

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
                placeholder="Escribí tus notas del proyecto acá..."
                className="w-full min-h-[120px] rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-3 py-2 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/40 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition"
              style={{ fontSize: "16px" }}
              />
              <div className="text-xs text-right mt-1 h-4 text-[var(--color-foreground)]/40">
                <AnimatePresence>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
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
                      Guardando...
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
