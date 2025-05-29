"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeSettingsModal from "@/components/ui/ThemeSettingsModal";
import { Cog } from "lucide-react";

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
  }, []);

  return (
    <main className="px-4 py-8 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          Mis proyectos
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Cog className="w-5 h-5" />
          </button>
          <a
            href="/api/auth/signout"
            className="text-sm text-gray-600 underline"
          >
            Cerrar sesión
          </a>
        </div>
      </div>

      <Link href="/new">
        <button className="w-full bg-[var(--color-primary)] text-white text-lg py-3 rounded-xl shadow-md hover:bg-[var(--color-primary-hover)] mb-4">
          ➕ Nuevo proyecto
        </button>
      </Link>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No tenés proyectos todavía.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => {
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

            return (
              <li key={project.id}>
                <Link href={`/project/${project.id}`}>
                  <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer space-y-2">
                    <div className="font-semibold text-lg text-gray-800">
                      {project.name}
                    </div>
                    <div className="w-full h-3 bg-[var(--color-primary)/20] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
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
    </main>
  );
}
