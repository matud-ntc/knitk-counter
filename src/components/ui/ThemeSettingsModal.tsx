"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Toggle from "@/components/ui/Toggle";
import { useCounterSettings } from "@/lib/clientSettings";
import { deleteAccount } from "@/lib/actions/deleteAccount";

const THEMES = [
  { value: "theme-salmon", label: "Salmón", bg: "#FAF3EC", surface: "#FFFFFF", accent: "#EE7B5F", color: "#3A302B" },
  { value: "theme-light", label: "Claro", bg: "#F5F2EE", surface: "#FFFFFF", accent: "#E58A6E", color: "#3A302B" },
  { value: "theme-dark", label: "Oscuro", bg: "#211B19", surface: "#2C2422", accent: "#F4855F", color: "#F3E9E2" },
  { value: "theme-mocha", label: "Mocha", bg: "#2B2622", surface: "#372F2A", accent: "#93B4D6", color: "#EDE3DA" },
  { value: "theme-nord", label: "Nord", bg: "#2E3440", surface: "#3B4252", accent: "#88C0D0", color: "#ECEFF4" },
  { value: "theme-rose", label: "Rosé Pine", bg: "#191724", surface: "#26233A", accent: "#C4A7E7", color: "#E0DEF4" },
];

const BASE_CLASS = "antialiased lana-bg";

function applyTheme(value: string) {
  document.body.className = `${BASE_CLASS} ${value}`;
  localStorage.setItem("theme", value);
  const color = getComputedStyle(document.body)
    .getPropertyValue("--color-primary")
    .trim();
  const meta = document.querySelector("meta[name='theme-color']");
  if (meta && color) meta.setAttribute("content", color);
}

export default function ThemeSettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState("theme-salmon");
  const [settings, setSettings] = useCounterSettings();

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "theme-salmon";
    setSelected(THEMES.some((t) => t.value === stored) ? stored : "theme-salmon");
  }, [open]);

  const pick = (value: string) => {
    setSelected(value);
    applyTheme(value);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await deleteAccount();
      if (res.ok) {
        window.location.href = "/api/auth/signout?callbackUrl=/";
      } else {
        setDeleting(false);
      }
    } catch {
      setDeleting(false);
    }
  };

  const [watchCode, setWatchCode] = useState<string | null>(null);
  const [watchLoading, setWatchLoading] = useState(false);
  const [watchError, setWatchError] = useState<string | null>(null);

  const generateWatchCode = async () => {
    setWatchLoading(true);
    setWatchError(null);
    try {
      const res = await fetch("/api/watch/pair", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWatchCode(data.code as string);
    } catch {
      setWatchError("No se pudo generar el código. Probá de nuevo.");
    } finally {
      setWatchLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajustes">
      <div className="space-y-6">
        {/* Tema */}
        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted-fg)]">
            Tema
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {THEMES.map((t) => {
              const active = selected === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => pick(t.value)}
                  className={`rounded-[18px] p-2.5 text-left transition ${
                    active
                      ? "border-2 border-[var(--color-primary)] [box-shadow:0_6px_16px_rgba(var(--shadow-rgb),0.18)]"
                      : "border-[1.5px] border-[var(--border-soft)]"
                  }`}
                >
                  <div
                    className="flex h-[58px] flex-col justify-center gap-1.5 rounded-xl p-2.5"
                    style={{ background: t.bg }}
                  >
                    <span
                      className="h-2 w-[65%] rounded"
                      style={{ background: t.surface }}
                    />
                    <span className="flex gap-1.5">
                      <span
                        className="h-3 w-5 rounded"
                        style={{ background: t.accent }}
                      />
                      <span
                        className="h-3 w-7 rounded"
                        style={{ background: t.surface }}
                      />
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--foreground)]">
                      {t.label}
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        active
                          ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                          : "border-2 border-[var(--border-soft)]"
                      }`}
                    >
                      {active && <CheckSmall />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Contador */}
        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted-fg)]">
            Contador
          </h4>
          <div className="overflow-hidden rounded-2xl knit-surface shadow-soft">
            <Row
              label="Vibración al sumar"
              checked={settings.vibrate}
              onChange={(v) => setSettings({ vibrate: v })}
            />
            <Divider />
            <Row
              label="Mantener pantalla encendida"
              checked={settings.keepAwake}
              onChange={(v) => setSettings({ keepAwake: v })}
            />
            <Divider />
            <Row
              label="Sonido del contador"
              checked={settings.sound}
              onChange={(v) => setSettings({ sound: v })}
            />
          </div>
        </section>

        {/* Apple Watch */}
        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted-fg)]">
            Apple Watch
          </h4>
          <div className="rounded-2xl knit-surface p-4 shadow-soft">
            {watchCode ? (
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-xs font-medium text-[var(--muted-fg)]">
                  Escribí este código en el reloj
                </span>
                <span className="font-display text-4xl font-extrabold tracking-[0.18em] text-[var(--foreground)]">
                  {watchCode}
                </span>
                <span className="text-xs font-medium text-[var(--muted-fg)]">
                  Vence en 10 min · de un solo uso
                </span>
                <button
                  onClick={generateWatchCode}
                  disabled={watchLoading}
                  className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-60"
                >
                  {watchLoading && <Spinner />}
                  {watchLoading ? "Generando…" : "Generar otro"}
                </button>
              </div>
            ) : (
              <button
                onClick={generateWatchCode}
                disabled={watchLoading}
                className="grad-primary flex h-[50px] w-full items-center justify-center gap-2 rounded-[16px] text-[15px] font-bold text-[var(--color-on-primary)] shadow-soft active:scale-95 transition disabled:opacity-70"
              >
                {watchLoading && <Spinner />}
                {watchLoading ? "Generando…" : "Generar código para el Watch"}
              </button>
            )}
            {watchError && (
              <p className="mt-2 text-center text-sm font-medium text-[var(--color-primary)]">
                {watchError}
              </p>
            )}
          </div>
        </section>

        {/* Cuenta */}
        <section>
          <a
            href="/api/auth/signout"
            className="flex items-center gap-3 rounded-2xl knit-surface px-4 py-3 shadow-soft"
          >
            <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[var(--chip-bg)] text-lg font-bold text-[var(--chip-fg)]">
              🧶
            </span>
            <span className="flex-1 text-[15px] font-semibold text-[var(--foreground)]">
              Tu cuenta
            </span>
            <span className="text-sm font-bold text-[var(--color-primary)]">
              Salir
            </span>
          </a>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-[#d33]/40 px-4 py-3 text-sm font-bold text-[#d33] active:scale-95 transition disabled:opacity-60"
          >
            {deleting && <Spinner />}
            {deleting
              ? "Eliminando…"
              : confirmDelete
              ? "Tocá de nuevo para confirmar"
              : "Eliminar cuenta"}
          </button>
          {confirmDelete && !deleting && (
            <p className="mt-1.5 text-center text-xs font-medium text-[var(--muted-fg)]">
              Se borran tu cuenta y todos tus proyectos. No se puede deshacer.
            </p>
          )}
        </section>
      </div>
    </Modal>
  );
}

function Row({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-[15px] font-semibold text-[var(--foreground)]">
        {label}
      </span>
      <Toggle checked={checked} onChange={onChange} ariaLabel={label} />
    </div>
  );
}

function Divider() {
  return <div className="mx-4 h-px bg-[var(--border-soft)]" />;
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}

function CheckSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
