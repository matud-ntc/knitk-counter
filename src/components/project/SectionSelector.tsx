"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import SectionSelect from "@/components/ui/SectionSelect";
import Button from "@/components/ui/Button";
import GrowingInput from "@/components/ui/GrowingInput";
import { addSection, editSection, deleteSection } from "@/lib/actions/sectionActions";
import { motion, AnimatePresence } from "framer-motion";

type Section = {
  id: string;
  name: string;
  totalRows?: number;
};

type Props = {
  projectId: string;
  sections: Section[];
  currentId: string;
  revalidatePath: string;
};

type Panel = "none" | "add" | "edit" | "confirmDelete";

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
  revalidatePath,
}: Props) {
  const [panel, setPanel] = useState<Panel>("none");
  const [name, setName] = useState("");
  const [rows, setRows] = useState<number | undefined>();

  const currentSection = sections.find((s) => s.id === currentId);

  const openAdd = () => {
    setName("");
    setRows(undefined);
    setPanel("add");
  };

  const openEdit = () => {
    if (!currentSection) return;
    setName(currentSection.name);
    setRows(currentSection.totalRows);
    setPanel("edit");
  };

  const closePanel = () => setPanel("none");

  const panelContent = {
    add: (
      <form
        action={async (formData) => {
          await addSection(formData);
          closePanel();
        }}
        className="flex flex-col gap-3"
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
          placeholder="Filas (opcional)"
          value={rows ?? ""}
          onChange={(e) => setRows(Number(e.target.value))}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={closePanel}>
            Cancelar
          </Button>
          <SubmitButton label="Agregar" />
        </div>
      </form>
    ),
    edit: currentSection ? (
      <form
        action={async (formData) => {
          await editSection(formData);
          closePanel();
        }}
        className="flex flex-col gap-3"
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
          placeholder="Filas (opcional)"
          value={rows ?? ""}
          onChange={(e) => setRows(Number(e.target.value))}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={closePanel}>
            Cancelar
          </Button>
          <SubmitButton label="Guardar" />
        </div>
      </form>
    ) : null,
    confirmDelete: currentSection ? (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-[var(--color-foreground)]/80">
          ¿Borrar <strong>{currentSection.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={closePanel}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              await deleteSection(currentSection.id, revalidatePath);
              closePanel();
            }}
          >
            Borrar
          </Button>
        </div>
      </div>
    ) : null,
    none: null,
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <SectionSelect options={sections} currentId={currentId} />
        </div>

        <Button type="button" onClick={openEdit} variant="secondary" title="Editar sección">
          ✏️
        </Button>

        <Button
          type="button"
          onClick={() => setPanel("confirmDelete")}
          variant="secondary"
          title="Borrar sección"
        >
          🗑
        </Button>

        <Button type="button" onClick={openAdd} variant="secondary" title="Nueva sección">
          ➕
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {panel !== "none" && panelContent[panel] && (
          <motion.div
            key={panel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-4">
              {panelContent[panel]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
