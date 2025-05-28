import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">{children}</div>
  );
}
