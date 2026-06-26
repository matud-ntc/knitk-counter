"use client";

export default function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className="relative h-[27px] w-[46px] shrink-0 rounded-full transition-colors"
      style={{
        backgroundColor: checked ? "var(--color-primary)" : "var(--track)",
      }}
    >
      <span
        className="absolute top-[3px] h-[21px] w-[21px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all"
        style={{ left: checked ? 22 : 3 }}
      />
    </button>
  );
}
