"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { haptic, useCounterSettings } from "@/lib/clientSettings";

/* ── Háptica iOS: overlay <input switch> invisible ─────────────────────
   iOS 26.5+ solo dispara el tick si el dedo toca un <input switch> nativo
   de verdad (no por script). Este overlay se monta DENTRO de un contenedor
   position:relative y, en iOS, recibe el tap (llama onTap). Si la háptica
   está apagada no se renderiza y el tap cae en el botón de abajo.
   En Android el tick lo da navigator.vibrate vía haptic() dentro de onTap. */
export function HapticOverlay({
  onTap,
  rounded = true,
}: {
  onTap: () => void;
  rounded?: boolean;
}) {
  const [settings] = useCounterSettings();
  if (!settings.vibrate) return null;
  return (
    <input
      // El atributo WebKit `switch` no está tipado; lo seteamos por ref.
      ref={(el) => {
        if (el) el.setAttribute("switch", "");
      }}
      type="checkbox"
      tabIndex={-1}
      aria-hidden
      onClick={onTap}
      className={clsx(
        "absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0",
        rounded ? "[clip-path:inset(0_round_9999px)]" : "[clip-path:inset(0_round_20px)]",
      )}
    />
  );
}

/* ── Número grande con "pop" en cada cambio ────────────────────────── */
export function BigNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      key={value}
      className={clsx("pop-num no-select font-extrabold tabular-nums", className)}
      style={{ fontFamily: "var(--font-primary)" }}
    >
      {value}
    </span>
  );
}

/* ── Botón "+" héroe: halo que respira + onda al tocar + háptica ────── */
export function PlusButton({
  onAdd,
  size = 128,
  plusSize = 72,
  label,
}: {
  onAdd: () => void;
  size?: number;
  plusSize?: number;
  label?: string;
}) {
  const [pulses, setPulses] = useState<number[]>([]);
  const idRef = useRef(0);

  const handle = () => {
    const id = ++idRef.current;
    setPulses((p) => [...p, id]);
    onAdd();
  };

  return (
    <div
      className="relative flex items-center justify-center transition active:scale-95"
      style={{ width: size, height: size }}
    >
      {/* halo */}
      <div
        className="halo-breath pointer-events-none absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: size,
          height: size,
          background: "radial-gradient(circle, var(--halo), transparent 70%)",
        }}
      />
      {/* ondas */}
      {pulses.map((id) => (
        <span
          key={id}
          onAnimationEnd={() =>
            setPulses((p) => p.filter((x) => x !== id))
          }
          className="ring-pulse pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: size,
            height: size,
            border: "4px solid var(--color-primary)",
          }}
        />
      ))}
      <button
        onClick={handle}
        aria-label={label ?? "Sumar fila"}
        className="grad-counter relative flex items-center justify-center rounded-full text-[var(--color-on-primary)] transition active:scale-95 [box-shadow:0_16px_34px_rgba(var(--shadow-rgb),0.5),inset_0_2px_0_rgba(255,255,255,0.4)]"
        style={{ width: size, height: size }}
      >
        <span
          className="font-display leading-none"
          style={{ fontSize: plusSize, marginTop: -plusSize * 0.08, fontWeight: 300 }}
        >
          +
        </span>
      </button>
      {/* Overlay háptico iOS: el dedo toca el <input switch> real. */}
      <HapticOverlay onTap={handle} />
    </div>
  );
}

/* ── Control redondo chico (restar) ────────────────────────────────── */
export function RoundControl({
  onClick,
  ariaLabel,
  children,
  size = 62,
}: {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex items-center justify-center rounded-full bg-[var(--surface)] border-[1.5px] border-[var(--border-soft)] text-[var(--muted-fg)] shadow-soft transition active:scale-95"
      style={{ width: size, height: size }}
    >
      {children}
    </button>
  );
}

/* ── Botón reiniciar con "mantener para borrar" ────────────────────── */
export function HoldResetButton({
  onReset,
  size = 62,
  holdMs = 780,
}: {
  onReset: () => void;
  size?: number;
  holdMs?: number;
}) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    setHolding(true);
    timer.current = setTimeout(() => {
      setHolding(false);
      haptic([12, 40, 12]);
      onReset();
    }, holdMs);
  };
  const cancel = () => {
    setHolding(false);
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  return (
    <button
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      aria-label="Mantené para reiniciar"
      className="relative flex items-center justify-center overflow-hidden rounded-full bg-[var(--surface)] border-[1.5px] border-[var(--border-soft)] text-[var(--muted-fg)] shadow-soft transition active:scale-95"
      style={{ width: size, height: size }}
    >
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-[var(--chip-bg)]"
        style={{
          height: holding ? "100%" : "0%",
          transition: holding
            ? `height ${holdMs}ms linear`
            : "height 150ms ease-out",
        }}
      />
      <ResetIcon className="relative" />
    </button>
  );
}

export function ResetIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 12a8 8 0 1 0 2.3-5.6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M4 4v4h4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MinusGlyph() {
  return (
    <span
      className="font-display leading-none"
      style={{ fontSize: 40, marginTop: -6, fontWeight: 400 }}
    >
      −
    </span>
  );
}
