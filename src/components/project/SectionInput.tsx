"use client";

import GrowingInput from "../ui/GrowingInput";
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
    <div className="space-y-4">
      <GrowingInput
        type="text"
        placeholder="Nombre de la sección"
        value={data.name}
        onChange={(e) => onChange(index, "name", e.target.value)}
        className="block w-full"
        required
      />

      <GrowingInput
        type="number"
        placeholder="Filas (opcional)"
        value={data.totalRows ?? ""}
        onChange={(e) => onChange(index, "totalRows", e.target.value)}
        min={0}
        className="block w-full"
      />

      <div>
        <label className="text-sm">
          <input
            type="checkbox"
            checked={data.isFreeform}
            onChange={(e) => onChange(index, "isFreeform", e.target.checked)}
            className="mr-2"
          />
          Sección libre
        </label>
      </div>
      {onRemove && (
        <Button
          type="button"
          onClick={onRemove}
          variant="secondary"
          className="text-sm underline mt-2"
        >
          Eliminar sección
        </Button>
      )}
    </div>
  );
}
