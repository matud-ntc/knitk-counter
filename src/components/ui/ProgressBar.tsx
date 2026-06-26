import clsx from "clsx";

export default function ProgressBar({
  value,
  height = 10,
  className,
}: {
  value: number; // 0..100
  height?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={clsx(
        "w-full overflow-hidden rounded-full bg-[var(--track)] [box-shadow:inset_0_1px_2px_rgba(0,0,0,0.06)]",
        className,
      )}
      style={{ height }}
    >
      <div
        className="grad-bar h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
