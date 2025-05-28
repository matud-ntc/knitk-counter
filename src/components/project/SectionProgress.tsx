"use client";

type Props = {
  section: {
    totalRows: number | null;
    completedRows: number;
    isFreeform: boolean;
  };
};

export default function SectionProgress({ section }: Props) {
  const rowProgress = section.totalRows
    ? Math.round((section.completedRows / section.totalRows) * 100)
    : null;

  return (
    <div className="space-y-3 w-full">
      <div className="text-sm">
        <p>
          <strong>Filas:</strong>{" "}
          {section.totalRows
            ? `${section.completedRows} / ${section.totalRows} (${rowProgress}%)`
            : `${section.completedRows} filas (modo libre)`}
        </p>
      </div>

      {rowProgress !== null && (
        <div className="w-full h-4 bg-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-500 transition-all duration-300"
            style={{ width: `${rowProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
