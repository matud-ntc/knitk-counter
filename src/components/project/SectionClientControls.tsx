"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addRow, removeRow, resetRow } from "@/lib/actions/sectionActions";
import {
  BigNumber,
  PlusButton,
  RoundControl,
  HoldResetButton,
  MinusGlyph,
  ResetIcon,
} from "@/components/ui/CounterParts";
import { chime, haptic, tick, useCounterSettings, useWakeLock } from "@/lib/clientSettings";

type Props = {
  sectionId: string;
  revalidatePath: string;
  initialRowCount: number;
};

export default function SectionClientControls({
  sectionId,
  revalidatePath,
  initialRowCount,
}: Props) {
  const [, startTransition] = useTransition();
  const [localRow, setLocalRow] = useState(initialRowCount);
  const [settings] = useCounterSettings();
  useWakeLock(settings.keepAwake);

  // Recordatorio "avisar cada N filas" (persistido por sección)
  const reminderKey = `knitk-reminder-${sectionId}`;
  const [reminderEvery, setReminderEvery] = useState(0);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setLocalRow(initialRowCount);
  }, [sectionId, initialRowCount]);

  useEffect(() => {
    const stored = Number(localStorage.getItem(reminderKey) ?? 0);
    setReminderEvery(Number.isFinite(stored) ? stored : 0);
  }, [reminderKey]);

  const setReminder = (n: number) => {
    const v = Math.max(0, n);
    setReminderEvery(v);
    localStorage.setItem(reminderKey, String(v));
  };

  const add = () => {
    const next = localRow + 1;
    setLocalRow(next);
    const milestone = reminderEvery > 0 && next % reminderEvery === 0;
    if (milestone) {
      // Aviso "cada N": háptico fuerte + chime distinto (sin el tick del +)
      haptic([20, 60, 20]);
      chime();
      setToast(true);
      setTimeout(() => setToast(false), 1800);
    } else {
      haptic();
      tick();
    }
    startTransition(() => addRow(sectionId, revalidatePath));
  };
  const sub = () => {
    setLocalRow((n) => Math.max(0, n - 1));
    startTransition(() => removeRow(sectionId, revalidatePath));
  };
  const reset = () => {
    setLocalRow(0);
    startTransition(() => resetRow(sectionId, revalidatePath));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <BigNumber
        value={localRow}
        className="text-[110px] leading-[0.9] text-[var(--foreground)]"
      />
      <span className="mb-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-fg)]">
        filas tejidas
      </span>

      <div className="flex items-center justify-center gap-5">
        <RoundControl onClick={sub} ariaLabel="Restar fila" size={62}>
          <MinusGlyph />
        </RoundControl>
        <PlusButton onAdd={add} size={128} plusSize={72} />
        <HoldResetButton onReset={reset} size={62} />
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[var(--muted-fg)]">
        <ResetIcon />
        Mantené reiniciar para borrar todo
      </div>

      {/* Avisar cada N filas */}
      <div className="mt-4 flex w-full items-center gap-3 rounded-2xl knit-surface px-3.5 py-2.5 shadow-soft">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)] text-sm font-extrabold text-[var(--chip-fg)]">
          !
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold leading-tight text-[var(--foreground)]">
            Avisar cada {reminderEvery > 0 ? reminderEvery : "—"} filas
          </div>
          <div className="truncate text-xs font-medium text-[var(--muted-fg)]">
            {reminderEvery > 0
              ? `Próximo aviso en la fila ${
                  (Math.floor(localRow / reminderEvery) + 1) * reminderEvery
                }`
              : "Vibra al llegar al múltiplo"}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Stepper
            onClick={() => setReminder(reminderEvery - 1)}
            disabled={reminderEvery <= 0}
            label="menos"
          >
            −
          </Stepper>
          <span className="w-6 text-center text-sm font-bold text-[var(--foreground)]">
            {reminderEvery}
          </span>
          <Stepper onClick={() => setReminder(reminderEvery + 1)} label="más">
            +
          </Stepper>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl grad-primary px-5 py-3 text-sm font-bold text-[var(--color-on-primary)] shadow-float"
          >
            🧶 Llegaste a {localRow} filas
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stepper({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-2)] border border-[var(--border-soft)] font-display text-lg leading-none text-[var(--muted-fg)] disabled:opacity-40 active:scale-95 transition"
    >
      {children}
    </button>
  );
}
