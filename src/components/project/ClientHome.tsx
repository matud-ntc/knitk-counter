"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeSettingsModal from "@/components/ui/ThemeSettingsModal";
import Button from "@/components/ui/Button";

type Props = {
  projects: {
    id: string;
    name: string;
    sections: {
      totalRows: number | null;
      completedRows: number;
    }[];
  }[];
};

export default function ClientHome({ projects }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "theme-salmon";
    document.body.className = storedTheme;

    const color = getComputedStyle(document.body)
      .getPropertyValue("--color-primary")
      .trim();
    const metaTag = document.querySelector("meta[name='theme-color']");
    if (metaTag && color) {
      metaTag.setAttribute("content", color);
    }
  }, []);

  return (
    <main className="px-4 py-8 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          Mis proyectos
        </h1>
        <a href="/api/auth/signout" className="text-sm text-gray-600 underline">
          Cerrar sesión
        </a>
      </div>

      <Link href="/new">
        <button className="w-full bg-[var(--color-primary)] text-white text-lg py-3 rounded-xl shadow-md hover:bg-[var(--color-primary-hover)] mb-4">
          ➕ Nuevo proyecto
        </button>
      </Link>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No tenés proyectos todavía.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project, index) => {
            const total = project.sections.reduce(
              (acc, s) => acc + (s.totalRows ?? 0),
              0,
            );
            const completed = project.sections.reduce(
              (acc, s) => acc + s.completedRows,
              0,
            );
            const progress =
              total > 0 ? Math.round((completed / total) * 100) : 0;

            const bgClass = `card-bg-${index % 4}`;

            return (
              <li key={project.id}>
                <Link href={`/project/${project.id}`}>
                  <div
                    className={`p-4 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer space-y-2 transform active:scale-95 ${bgClass}`}
                  >
                    <div className="font-semibold text-base text-[var(--color-foreground)] text-center truncate">
                      {project.name}
                    </div>
                    <div className="w-full h-2.5 bg-[var(--color-primary)/20] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-[var(--color-foreground)/70] text-center">
                      {progress}% completado
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <ThemeSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <div className="fixed bottom-4 right-4 z-50">
        <Button
          type="button"
          onClick={() => setSettingsOpen(true)}
          variant="secondary"
        >
          ⚙️
        </Button>
      </div>
    </main>
  );
}
