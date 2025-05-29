// src/components/ui/ThemeHydration.tsx
"use client";

import { useEffect } from "react";

export default function ThemeHydration() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "theme-salmon";
    document.body.className = theme;
  }, []);

  return null;
}
