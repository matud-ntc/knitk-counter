import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
        className,
      )}
    />
  );
}
