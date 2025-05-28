"use client";

type Section = {
  id: string;
  name: string;
  totalRows: number | null;
  totalStitches: number | null;
  completedRows: number;
  completedStitches: number;
  isFreeform: boolean;
  order: number;
  projectId: string;
};

type Props = {
  section: Section;
};

export default function SectionProgress({ section }: Props) {
  const rowProgress = section.totalRows
    ? Math.round((section.completedRows / section.totalRows) * 100)
    : undefined;

  const stitchProgress = section.totalStitches
    ? Math.round((section.completedStitches / section.totalStitches) * 100)
    : undefined;

  const percent = stitchProgress ?? rowProgress ?? 0;

  return (
    <div className="space-y-3 w-full">
      <div className="text-sm">
        <p>
          <strong>Filas:</strong>{" "}
          {section.totalRows
            ? `${section.completedRows} / ${section.totalRows} (${rowProgress}%)`
            : `${section.completedRows} filas (modo libre)`}
        </p>
        <p>
          <strong>Puntos:</strong>{" "}
          {section.totalStitches
            ? `${section.completedStitches} / ${section.totalStitches} (${stitchProgress}%)`
            : `${section.completedStitches} puntos (modo libre)`}
        </p>
      </div>

      <div className="w-full h-4 bg-pink-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-pink-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
