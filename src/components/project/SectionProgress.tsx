"use client";

import ProgressBar from "@/components/ui/ProgressBar";

type Props = {
  name: string;
  section: {
    totalRows: number | null;
    completedRows: number;
    isFreeform: boolean;
  };
};

export default function SectionProgress({ name, section }: Props) {
  const hasTotal = !!section.totalRows && section.totalRows > 0;
  const pct = hasTotal
    ? Math.round((section.completedRows / section.totalRows!) * 100)
    : null;

  return (
    <div className="w-full">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[17px] font-bold text-[var(--foreground)]">
          {name}
        </span>
        <span className="text-[13px] font-semibold text-[var(--muted-fg)]">
          {hasTotal
            ? `${section.completedRows} / ${section.totalRows} · ${pct}%`
            : `${section.completedRows} filas · libre`}
        </span>
      </div>
      {pct !== null && <ProgressBar value={pct} height={10} className="mt-2.5" />}
    </div>
  );
}
