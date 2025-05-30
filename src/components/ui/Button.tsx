import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "outline";
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
    "transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
    circle
      ? "w-10 h-10 rounded-full flex items-center justify-center text-xl"
      : "px-4 py-2 rounded-xl font-semibold",
  );

  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline:
      "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white bg-transparent",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
