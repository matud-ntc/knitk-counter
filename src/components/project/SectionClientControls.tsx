"use client";

import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addRow, removeRow, resetRow } from "@/lib/actions/sectionActions";
import Button from "@/components/ui/Button";

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
  const [isPending, startTransition] = useTransition();
  const [localRow, setLocalRow] = useState(initialRowCount);
  const [resetBurst, setResetBurst] = useState(false);

  useEffect(() => {
    setLocalRow(initialRowCount);
  }, [sectionId, initialRowCount]);

  const handle = (action: () => Promise<void>, update?: () => void) => {
    if (update) update();
    startTransition(async () => {
      await action();
    });
  };

  const handleReset = () => {
    setResetBurst(true);
    setTimeout(() => setResetBurst(false), 600);
    handle(
      () => resetRow(sectionId, revalidatePath),
      () => setLocalRow(0),
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-4 mt-6"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <AnimatePresence>
            {resetBurst && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1.2,
                      x: Math.cos((i / 6) * Math.PI * 2) * 48,
                      y: Math.sin((i / 6) * Math.PI * 2) * 48,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[var(--color-primary)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <motion.span
            key={localRow}
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-4xl font-bold text-[var(--color-foreground)] block"
          >
            {localRow}
          </motion.span>
        </div>

        <button
          onClick={() =>
            handle(
              () => addRow(sectionId, revalidatePath),
              () => setLocalRow((n) => n + 1),
            )
          }
          className="bg-[var(--color-primary)] active:scale-95 hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] text-6xl w-28 h-28 rounded-full flex items-center justify-center shadow-md transition-transform"
        >
          +
        </button>

        <button
          onClick={() =>
            handle(
              () => removeRow(sectionId, revalidatePath),
              () => setLocalRow((n) => Math.max(0, n - 1)),
            )
          }
          className="bg-gray-200 active:scale-95 hover:bg-gray-300 text-2xl w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform"
        >
          −
        </button>
      </div>

      <Button
        variant="outline"
        circle
        title="Reiniciar sección"
        onClick={handleReset}
      >
        ↺
      </Button>
    </motion.div>
  );
}
