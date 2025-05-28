"use client";

import { addStitch, removeStitch, addRow } from "@/lib/actions/sectionActions";
import { useTransition, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  sectionId: string;
  revalidatePath: string;
  initialStitchCount: number;
};

export default function SectionClientControls({
  sectionId,
  revalidatePath,
  initialStitchCount,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [localStitch, setLocalStitch] = useState(initialStitchCount);

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
      <div className="flex items-center gap-6">
        <button
          onClick={() =>
            handle(() => removeStitch(sectionId, revalidatePath), () =>
              setLocalStitch((n) => Math.max(0, n - 1))
            )
          }
  className="bg-gray-200 hover:bg-gray-300 text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-inner transition"
        >
          −
        </button>

        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">Puntos</span>
          <motion.span
            key={localStitch}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="text-3xl font-bold text-gray-800"
          >
            {localStitch}
          </motion.span>
        </div>

        <button
          onClick={() =>
            handle(() => addStitch(sectionId, revalidatePath), () =>
              setLocalStitch((n) => n + 1)
            )
          }
          className="bg-pink-500 hover:bg-pink-600 text-white text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-md"
        >
          +
        </button>
      </div>

      <button
        onClick={() => handle(() => addRow(sectionId, revalidatePath))}
        className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2 rounded-lg shadow-sm mt-2 flex items-center gap-2"
      >
        ✅ Terminar fila
      </button>
    </motion.div>
  );
}
