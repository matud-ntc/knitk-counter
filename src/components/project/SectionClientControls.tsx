"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { addRow, removeRow } from "@/lib/actions/sectionActions";

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

  // 🔁 Sync localRow when sectionId or initialRowCount changes
  useEffect(() => {
    setLocalRow(initialRowCount);
  }, [sectionId, initialRowCount]);

  const handle = (action: () => Promise<void>, update?: () => void) => {
    startTransition(() => {
      if (update) update();
      action();
    });
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
        <span className="text-sm text-gray-500">Fila actual</span>

        <motion.span
          key={localRow}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="text-4xl font-bold text-gray-800"
        >
          {localRow}
        </motion.span>

        <button
          onClick={() =>
            handle(() => addRow(sectionId, revalidatePath), () =>
              setLocalRow((n) => n + 1)
            )
          }
          className="bg-pink-500 hover:bg-pink-600 text-white text-9xl w-35 h-35 rounded-full flex items-center justify-center shadow-md"
        >
          +
        </button>

        <button
          onClick={() =>
            handle(() => removeRow(sectionId, revalidatePath), () =>
              setLocalRow((n) => Math.max(0, n - 1))
            )
          }
          className="bg-gray-200 hover:bg-gray-300 text-2xl w-10 h-10 rounded-full flex items-center justify-center shadow-md"
        >
          −
        </button>
      </div>
    </motion.div>
  );
}
