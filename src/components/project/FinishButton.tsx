"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { finishProject } from "@/lib/actions/projectActions";

type Props = {
  projectId: string;
};

const CONFETTI_COUNT = 12;
const COLORS = ["#f97362", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#a78bfa"];

export default function FinishButton({ projectId }: Props) {
  const [burst, setBurst] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setBurst(true);
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 900));
      await finishProject(projectId, "/");
    });
  };

  return (
    <div className="relative mt-10 flex justify-center">
      <AnimatePresence>
        {burst &&
          [...Array(CONFETTI_COUNT)].map((_, i) => {
            const angle = (i / CONFETTI_COUNT) * Math.PI * 2;
            const dist = 60 + (i % 3) * 20;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist - 20,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-sm pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
            );
          })}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        disabled={isPending}
        whileTap={{ scale: 0.94 }}
        animate={burst ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="w-full px-4 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Finalizando..." : "Finalizar proyecto"}
      </motion.button>
    </div>
  );
}
