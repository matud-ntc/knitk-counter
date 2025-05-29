"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import SectionSelect from "@/components/ui/SectionSelect";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import GrowingInput from "@/components/ui/GrowingInput";
import { addSection, editSection } from "@/lib/actions/sectionActions";

type Section = {
  id: string;
  name: string;
  totalRows?: number;
};

type Props = {
  projectId: string;
  sections: Section[];
  currentId: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : label}
    </Button>
  );
}

export default function SectionSelector({
  projectId,
  sections,
  currentId,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [name, setName] = useState("");
  const [rows, setRows] = useState<number | undefined>();

  const currentSection = sections.find((s) => s.id === currentId);

  const openAdd = () => {
    setName("");
    setRows(undefined);
    setAddOpen(true);
  };

  const openEdit = () => {
    if (!currentSection) return;
    setName(currentSection.name);
    setRows(currentSection.totalRows);
    setEditOpen(true);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <SectionSelect options={sections} currentId={currentId} />
      </div>

      {/* Botón de editar */}
      <Button type="button" onClick={openEdit} variant="secondary">
        ✏️
      </Button>

      {/* Botón de crear */}
      <Button type="button" onClick={openAdd} variant="secondary">
        ➕
      </Button>

      {/* Modal agregar */}
      {addOpen && (
        <Modal onClose={() => setAddOpen(false)} title="Nueva sección">
          <form
            action={async (formData) => {
              await addSection(formData);
              setAddOpen(false);
            }}
          >
            <input type="hidden" name="projectId" value={projectId} />
            <GrowingInput
              name="name"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <GrowingInput
              name="totalRows"
              type="number"
              placeholder="Filas"
              value={rows ?? ""}
              onChange={(e) => setRows(Number(e.target.value))}
            />
            <div className="mt-4">
              <SubmitButton label="Agregar" />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal editar */}
      {editOpen && currentSection && (
        <Modal onClose={() => setEditOpen(false)} title="Editar sección">
          <form
            action={async (formData) => {
              await editSection(formData);
              setEditOpen(false);
            }}
          >
            <input type="hidden" name="id" value={currentSection.id} />
            <GrowingInput
              name="name"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <GrowingInput
              name="totalRows"
              type="number"
              placeholder="Filas"
              value={rows ?? ""}
              onChange={(e) => setRows(Number(e.target.value))}
            />
            <div className="mt-4">
              <SubmitButton label="Guardar cambios" />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
