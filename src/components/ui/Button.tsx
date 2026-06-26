import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  circle?: boolean;
};

export default function Button({
  children,
  className,
  variant = "primary",
  circle = false,
  ...props
}: Props) {
  const base = clsx(
    "transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none",
    circle
      ? "w-12 h-12 rounded-full flex items-center justify-center text-xl"
      : "px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2",
  );

  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary:
      "grad-primary text-[var(--color-on-primary)] [box-shadow:0_8px_20px_rgba(var(--shadow-rgb),0.35),inset_0_1px_0_rgba(255,255,255,0.3)]",
    secondary:
      "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border-soft)] shadow-soft",
    outline:
      "bg-[var(--surface)] text-[var(--color-primary)] border-[1.5px] border-[var(--color-primary)]/40",
    ghost: "bg-transparent text-[var(--muted-fg)]",
    danger: "bg-[var(--surface)] text-red-500 border border-red-300/50",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
