"use client";

import type { SectionInput as SectionInputData } from "@/types";
import Toggle from "@/components/ui/Toggle";

type Props = {
  index: number;
  data: SectionInputData;
  onChange: (
    index: number,
    key: keyof SectionInputData,
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
    <div className="flex flex-col gap-3 rounded-[18px] knit-surface p-3.5 shadow-soft">
      <div className="flex items-center gap-2.5">
        <Grip />
        <input
          value={data.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          placeholder="Nombre de la sección"
          required
          className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-[var(--foreground)] placeholder:text-[var(--muted-fg)]/70 outline-none"
        />
        {data.isFreeform ? (
          <span className="rounded-xl bg-[var(--chip-bg)] px-3 py-1.5 text-[13px] font-bold text-[var(--chip-fg)]">
            libre
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-input)] px-3 py-1.5 text-sm font-bold text-[var(--foreground)]">
            <input
              type="number"
              min={0}
              value={data.totalRows ?? ""}
              onChange={(e) => onChange(index, "totalRows", e.target.value)}
              placeholder="120"
              className="w-12 bg-transparent text-right outline-none"
            />
            <span className="text-[11px] font-medium text-[var(--muted-fg)]">
              filas
            </span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-[13px] font-medium ${
            data.isFreeform
              ? "text-[var(--chip-fg)]"
              : "text-[var(--muted-fg)]"
          }`}
        >
          Sección libre (sin meta)
        </span>
        <Toggle
          checked={data.isFreeform}
          onChange={(v) => onChange(index, "isFreeform", v)}
        />
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="self-start text-[13px] font-semibold text-[var(--muted-fg)] underline"
        >
          Eliminar sección
        </button>
      )}
    </div>
  );
}

function Grip() {
  return (
    <span className="grid shrink-0 grid-cols-2 gap-[3px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="h-[3px] w-[3px] rounded-full bg-[var(--muted-fg)]/50"
        />
      ))}
    </span>
  );
}
