import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={clsx("w-full p-2 border rounded", className)}
    />
  );
}
