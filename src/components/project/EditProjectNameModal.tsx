"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import GrowingInput from "@/components/ui/GrowingInput";
import { editProjectName } from "@/lib/actions/projectActions";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  currentName: string;
};

export default function EditProjectNameModal({
  open,
  onClose,
  projectId,
  currentName,
}: Props) {
  const [name, setName] = useState(currentName);
  const router = useRouter();

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSave = async () => {
    await editProjectName(projectId, name);
    onClose();
    router.refresh();
  };

  return (
    <Modal open={open} onClose={onClose} title="Cambiar nombre del proyecto">
      <GrowingInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nuevo nombre"
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>Guardar</Button>
      </div>
    </Modal>
  );
}
