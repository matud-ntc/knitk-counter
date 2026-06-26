import clsx from "clsx";

/** Logo "K" en cuadrado redondeado con dos marcas de aguja de tejer. */
export default function Logo({
  size = 108,
  radius = 30,
  className,
}: {
  size?: number;
  radius?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "grad-counter relative flex items-center justify-center shrink-0 [box-shadow:0_20px_40px_rgba(var(--shadow-rgb),0.45),inset_0_2px_0_rgba(255,255,255,0.4)]",
        className,
      )}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <span
        className="font-display text-white leading-none"
        style={{ fontSize: size * 0.55, fontWeight: 700 }}
      >
        K
      </span>
      <span
        className="absolute bg-white/70"
        style={{
          top: size * 0.19,
          right: size * 0.17,
          width: size * 0.2,
          height: 3.5,
          borderRadius: 2,
          transform: "rotate(-45deg)",
        }}
      />
      <span
        className="absolute bg-white/50"
        style={{
          bottom: size * 0.19,
          left: size * 0.17,
          width: size * 0.2,
          height: 3.5,
          borderRadius: 2,
          transform: "rotate(-45deg)",
        }}
      />
    </div>
  );
}
