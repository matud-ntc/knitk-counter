"use client";

import { useState } from "react";
import Link from "next/link";
import SectionInput from "./SectionInput";
import type { SectionInput as SectionInputData } from "@/types";

export default function ProjectForm() {
  const [projectName, setProjectName] = useState("");
  const [sections, setSections] = useState<SectionInputData[]>([
    { name: "", isFreeform: false },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    index: number,
    key: keyof SectionInputData,
    value: string | boolean,
  ) => {
    setSections((prev) => {
      const copy = [...prev];
      if (key === "totalRows") {
        copy[index] = {
          ...copy[index],
          totalRows: value === "" ? undefined : Number(value),
        };
      } else {
        copy[index] = { ...copy[index], [key]: value } as SectionInputData;
      }
      return copy;
    });
  };

  const handleAdd = () =>
    setSections((prev) => [...prev, { name: "", isFreeform: false }]);

  const handleRemove = (index: number) =>
    setSections((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = sections.map((s) => ({
      name: s.name,
      isFreeform: s.isFreeform,
      totalRows: s.isFreeform ? undefined : s.totalRows,
    }));
    const res = await fetch("/api/project", {
      method: "POST",
      body: JSON.stringify({ projectName, sections: payload }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    window.location.href = `/project/${data.id}`;
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-28 pt-[max(3.5rem,calc(env(safe-area-inset-top)_+_0.5rem))]">
      <div className="flex items-center gap-3.5 pb-5">
        <Link
          href="/"
          aria-label="Volver"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] knit-surface text-[var(--muted-fg)] active:scale-95 transition"
        >
          <ChevronLeft />
        </Link>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
          Nuevo proyecto
        </h1>
      </div>

      <form onSubmit={handleSubmit} id="project-form" className="flex flex-col gap-5">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-[var(--muted-fg)]">
            Nombre del proyecto
          </span>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Sweater lana merino"
            required
            className="w-full rounded-2xl border-[1.5px] border-[var(--border-input)] bg-[var(--surface)] px-4 py-3.5 text-base font-medium text-[var(--foreground)] outline-none focus:border-[var(--color-primary)] shadow-soft"
          />
        </label>

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--muted-fg)]">
              Secciones
            </span>
            <span className="text-xs font-semibold text-[var(--muted-fg)]">
              {sections.length}{" "}
              {sections.length === 1 ? "sección" : "secciones"}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {sections.map((section, i) => (
              <SectionInput
                key={i}
                index={i}
                data={section}
                onChange={handleChange}
                onRemove={sections.length > 1 ? () => handleRemove(i) : undefined}
              />
            ))}

            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[var(--color-primary)]/40 px-4 py-3.5 text-sm font-bold text-[var(--color-primary)]"
            >
              <span className="font-display text-lg leading-none">+</span>
              Agregar sección
            </button>
          </div>
        </div>
      </form>

      {/* Botón fijo */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-5 pb-7 pt-4">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
          style={{
            background: "linear-gradient(0deg, var(--background) 55%, transparent)",
          }}
        />
        <button
          type="submit"
          form="project-form"
          disabled={submitting || !projectName.trim()}
          className="relative grad-primary h-[58px] w-full max-w-md rounded-[18px] text-[18px] font-bold text-[var(--color-on-primary)] [box-shadow:0_12px_26px_rgba(var(--shadow-rgb),0.45),inset_0_1px_0_rgba(255,255,255,0.3)] disabled:opacity-60 active:scale-95 transition"
        >
          {submitting ? "Creando…" : "Crear proyecto"}
        </button>
      </div>
    </main>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
