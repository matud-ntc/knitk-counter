import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: Props) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-pink-500 text-white hover:bg-pink-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
