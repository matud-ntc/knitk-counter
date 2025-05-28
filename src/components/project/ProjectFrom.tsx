"use client";

import { useState } from "react";
import SectionInput from "./SectionInput";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { SectionInput as Section } from "@/types";

export default function ProjectForm() {
  const [projectName, setProjectName] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { name: "", isFreeform: false },
  ]);

  const handleChange = (
    index: number,
    key: keyof Section,
    value: string | boolean,
  ) => {
    const copy = [...sections];
    if (key === "totalRows" || key === "totalStitches") {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Nombre del proyecto"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        required
      />

      {sections.map((section, i) => (
        <Card key={i}>
          <SectionInput
            index={i}
            data={section}
            onChange={handleChange}
            onRemove={sections.length > 1 ? () => handleRemove(i) : undefined}
          />
        </Card>
      ))}

      <Button
        type="button"
        onClick={handleAdd}
        variant="secondary"
        className="text-sm"
      >
        ➕ Agregar otra sección
      </Button>

      <Button type="submit" className="w-full mt-4">
        Crear proyecto
      </Button>
    </form>
  );
}
