"use client";

import { useState } from "react";
import SectionInput from "./SectionInput";
import GrowingInput from "../ui/GrowingInput";
import Button from "../ui/Button";

type SectionInput = {
  name: string;
  totalRows?: number;
  isFreeform: boolean;
};

export default function ProjectForm() {
  const [projectName, setProjectName] = useState("");
  const [sections, setSections] = useState<SectionInput[]>([
    { name: "", isFreeform: false },
  ]);

  const handleChange = (
    index: number,
    key: keyof SectionInput,
    value: string | boolean,
  ) => {
    const copy = [...sections];
    if (key === "totalRows") {
      copy[index][key] = value === "" ? undefined : Number(value);
    } else {
      copy[index][key] = value as never;
    }
    setSections(copy);
  };

  const handleAdd = () =>
    setSections([...sections, { name: "", isFreeform: false }]);

  const handleRemove = (index: number) =>
    setSections(sections.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/project", {
      method: "POST",
      body: JSON.stringify({ projectName, sections }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    window.location.href = `/project/${data.id}`;
  };

  return (
    <div className="pb-40 relative px-4 py-6">
      <form onSubmit={handleSubmit} className="space-y-10" id="project-form">
        {/* Nombre del proyecto */}
        <GrowingInput
          type="text"
          placeholder="Nombre del proyecto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />

        {/* Secciones */}
        {sections.map((section, i) => (
          <div key={i} className="space-y-6">
            <SectionInput
              index={i}
              data={section}
              onChange={handleChange}
              onRemove={sections.length > 1 ? () => handleRemove(i) : undefined}
            />
            {i < sections.length - 1 && (
              <hr className="border-t border-pink-200 my-8" />
            )}
          </div>
        ))}

        {/* Agregar sección */}
        <Button
          type="button"
          onClick={handleAdd}
          variant="secondary"
          className="text-sm"
        >
          ➕ Agregar otra sección
        </Button>
      </form>

      {/* Botón fijo */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center pointer-events-none">
        <Button
          type="submit"
          form="project-form"
          className="w-60 pointer-events-auto"
        >
          Crear proyecto
        </Button>
      </div>
    </div>
  );
}
