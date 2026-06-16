// src/components/ui/ThemeHydration.tsx
"use client";

import { useEffect } from "react";

export default function ThemeHydration() {
  useEffect(() => {
    const valid = ["theme-salmon", "theme-mocha", "theme-nord", "theme-rose"];
    const stored = localStorage.getItem("theme");
    const theme = stored && valid.includes(stored) ? stored : "theme-salmon";
    document.body.className = theme;
  }, []);

  return null;
}
