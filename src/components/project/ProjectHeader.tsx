"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  addSection,
  editSection,
  deleteSection,
} from "@/lib/actions/sectionActions";
import { finishProject } from "@/lib/actions/projectActions";

type Section = { id: string; name: string; totalRows?: number };

type Props = {
  projectId: string;
  projectName: string;
  sections: Section[];
  currentId: string;
  sectionIndex: number;
  revalidatePath: string;
  isFinished: boolean;
};

type ModalKind = null | "add" | "edit" | "delete";

export default function ProjectHeader({
  projectId,
  projectName,
  sections,
  currentId,
  sectionIndex,
  revalidatePath,
  isFinished,
}: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [name, setName] = useState("");
  const [rows, setRows] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  const current = sections.find((s) => s.id === currentId);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openAdd = () => {
    setName("");
    setRows("");
    setModal("add");
    setMenuOpen(false);
  };
  const openEdit = () => {
    if (!current) return;
    setName(current.name);
    setRows(current.totalRows ? String(current.totalRows) : "");
    setModal("edit");
    setMenuOpen(false);
  };

  const submitAdd = () => {
    const fd = new FormData();
    fd.set("projectId", projectId);
    fd.set("name", name);
    if (rows) fd.set("totalRows", rows);
    startTransition(async () => {
      await addSection(fd);
      setModal(null);
    });
  };
  const submitEdit = () => {
    if (!current) return;
    const fd = new FormData();
    fd.set("id", current.id);
    fd.set("name", name);
    if (rows) fd.set("totalRows", rows);
    startTransition(async () => {
      await editSection(fd);
      setModal(null);
    });
  };
  const submitDelete = () => {
    if (!current) return;
    startTransition(async () => {
      await deleteSection(current.id, revalidatePath);
      setModal(null);
      const remaining = sections.filter((s) => s.id !== current.id);
      if (remaining[0]) router.replace(`/project/${projectId}?section=${remaining[0].id}`);
      else router.replace(`/project/${projectId}`);
    });
  };
  const finish = () => {
    setMenuOpen(false);
    startTransition(async () => {
      await finishProject(projectId, "/");
    });
  };

  return (
    <>
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-2.5">
        <Link
          href="/"
          aria-label="Volver"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl knit-surface text-[var(--muted-fg)] active:scale-95 transition"
        >
          <ChevronLeft />
        </Link>
        <div className="text-center min-w-0">
          <div className="truncate text-base font-bold leading-tight text-[var(--foreground)]">
            {projectName}
          </div>
          <div className="text-xs font-medium text-[var(--muted-fg)]">
            Sección {sectionIndex + 1} de {sections.length}
          </div>
        </div>
        <div ref={menuRef} className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[3px] rounded-xl knit-surface active:scale-95 transition"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full bg-[var(--muted-fg)]"
              />
            ))}
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 z-50 w-56 rounded-2xl knit-surface p-1.5 shadow-float"
              >
                <MenuItem onClick={openEdit} label="Editar sección" icon={<PencilIcon />} />
                <MenuItem onClick={openAdd} label="Agregar sección" icon={<PlusGlyph />} />
                {sections.length > 1 && (
                  <MenuItem
                    onClick={() => {
                      setModal("delete");
                      setMenuOpen(false);
                    }}
                    label="Eliminar sección"
                    icon={<TrashIcon />}
                    danger
                  />
                )}
                {!isFinished && (
                  <>
                    <div className="my-1 h-px bg-[var(--border-soft)]" />
                    <button
                      onClick={finish}
                      disabled={pending}
                      className="flex w-full items-center gap-3 rounded-xl bg-[var(--chip-bg)] px-3 py-2.5 text-sm font-bold text-[var(--chip-fg)]"
                    >
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)]">
                        <CheckSmall />
                      </span>
                      Finalizar proyecto
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chips de secciones */}
      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
        {sections.map((s) => {
          const active = s.id === currentId;
          return (
            <Link
              key={s.id}
              href={`/project/${projectId}?section=${s.id}`}
              scroll={false}
              className={
                active
                  ? "grad-primary shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-[13px] font-bold text-[var(--color-on-primary)] [box-shadow:0_4px_10px_rgba(var(--shadow-rgb),0.35)]"
                  : "shrink-0 whitespace-nowrap rounded-xl knit-surface px-3.5 py-2 text-[13px] font-semibold text-[var(--muted-fg)]"
              }
            >
              {s.name || "Sección"}
            </Link>
          );
        })}
        <button
          onClick={openAdd}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border-[1.5px] border-dashed border-[var(--color-primary)]/40 px-3 py-2 text-[13px] font-bold text-[var(--color-primary)]"
        >
          <span className="font-display leading-none">+</span>
        </button>
      </div>

      {/* Modales add/edit */}
      <Modal
        open={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "edit" ? "Editar sección" : "Nueva sección"}
      >
        <div className="flex flex-col gap-4">
          <Field label="Nombre">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la sección"
              className="w-full rounded-2xl border-[1.5px] border-[var(--border-input)] bg-[var(--surface)] px-4 py-3 text-base font-medium text-[var(--foreground)] outline-none focus:border-[var(--color-primary)]"
            />
          </Field>
          <Field label="Filas (opcional)">
            <input
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              type="number"
              min={0}
              placeholder="Dejá vacío para sección libre"
              className="w-full rounded-2xl border-[1.5px] border-[var(--border-input)] bg-[var(--surface)] px-4 py-3 text-base font-medium text-[var(--foreground)] outline-none focus:border-[var(--color-primary)]"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancelar
            </Button>
            <Button
              onClick={modal === "edit" ? submitEdit : submitAdd}
              disabled={pending || !name.trim()}
            >
              {pending ? "Guardando…" : modal === "edit" ? "Guardar" : "Agregar"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmar eliminación */}
      <Modal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        title="Eliminar sección"
      >
        <p className="text-[15px] text-[var(--muted-fg)]">
          ¿Borrar <strong className="text-[var(--foreground)]">{current?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => setModal(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={submitDelete} disabled={pending}>
            {pending ? "Borrando…" : "Borrar"}
          </Button>
        </div>
      </Modal>
    </>
  );
}

function MenuItem({
  onClick,
  label,
  icon,
  danger,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
        danger ? "text-red-500" : "text-[var(--foreground)]"
      }`}
    >
      <span className="text-[var(--muted-fg)]">{icon}</span>
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-[var(--muted-fg)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M16.5 4.5l3 3L8 19l-4 1 1-4L16.5 4.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function PlusGlyph() {
  return <span className="font-display text-lg leading-none">+</span>;
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
