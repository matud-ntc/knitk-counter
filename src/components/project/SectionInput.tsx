"use client";

import Input from "../ui/Input";
import Button from "../ui/Button";
import type { SectionInput } from "@/types";

type Props = {
  index: number;
  data: SectionInput;
  onChange: (
    index: number,
    key: keyof SectionInput,
    value: string | boolean,
  ) => void;
  onRemove?: () => void;
};

export default function SectionInput({
  index,
  data,
  onChange,
  onRemove,
}: Props) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Nombre de la sección"
        value={data.name}
        onChange={(e) => onChange(index, "name", e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Filas (opcional)"
        value={data.totalRows ?? ""}
        onChange={(e) => onChange(index, "totalRows", e.target.value)}
      />
      <Input
        type="number"
        placeholder="Puntos (opcional)"
        value={data.totalStitches ?? ""}
        onChange={(e) => onChange(index, "totalStitches", e.target.value)}
      />
      <label className="text-sm">
        <input
          type="checkbox"
          checked={data.isFreeform}
          onChange={(e) => onChange(index, "isFreeform", e.target.checked)}
          className="mr-2"
        />
        Sección libre
      </label>
      {onRemove && (
        <Button
          type="button"
          onClick={onRemove}
          variant="danger"
          className="text-sm underline"
        >
          Eliminar sección
        </Button>
      )}
    </div>
  );
}
