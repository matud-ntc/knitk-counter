"use client";

import { useEffect, useState } from "react";

export type CounterSettings = {
  vibrate: boolean;
  keepAwake: boolean;
  sound: boolean;
};

const KEY = "knitk-settings";
const DEFAULTS: CounterSettings = {
  vibrate: true,
  keepAwake: true,
  sound: false,
};

export function readSettings(): CounterSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function writeSettings(next: CounterSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("knitk-settings", { detail: next }));
  } catch {
    /* ignore */
  }
}

/** Hook reactivo a los ajustes del contador. */
export function useCounterSettings(): [
  CounterSettings,
  (patch: Partial<CounterSettings>) => void,
] {
  const [settings, setSettings] = useState<CounterSettings>(DEFAULTS);

  useEffect(() => {
    setSettings(readSettings());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<CounterSettings>).detail;
      if (detail) setSettings(detail);
      else setSettings(readSettings());
    };
    window.addEventListener("knitk-settings", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("knitk-settings", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const update = (patch: Partial<CounterSettings>) => {
    const next = { ...readSettings(), ...patch };
    writeSettings(next);
    setSettings(next);
  };

  return [settings, update];
}

/* ── Háptica ─────────────────────────────────────────────────────────
   Android/Chrome: navigator.vibrate.
   iOS (Safari) nunca soportó la Vibration API, y desde iOS 26.5 Apple
   también bloqueó disparar el háptico del <input switch> por script
   (sw.click() ya no hace nada). En iOS la háptica ahora la produce
   <HapticOverlay/> (un <input switch> invisible que el DEDO toca directo
   sobre el botón). Esta función cubre Android; en iOS es no-op. */
export function haptic(pattern: number | number[] = 8) {
  if (typeof navigator === "undefined") return;
  if (!readSettings().vibrate) return;
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function blip(freq: number, start: number, dur = 0.12, peak = 0.18) {
  const ctx = audioCtx;
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const t = ctx.currentTime + start;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** Tick suave al sumar una fila (respeta el ajuste). */
export function tick() {
  if (!readSettings().sound) return;
  if (!getCtx()) return;
  blip(660, 0, 0.1, 0.16);
}

/** Chime ascendente distinto, para el aviso de "cada N filas". */
export function chime() {
  if (!readSettings().sound) return;
  if (!getCtx()) return;
  blip(784, 0, 0.14, 0.2); // Sol
  blip(1175, 0.13, 0.22, 0.22); // Re (octava arriba)
}

/** Mantiene la pantalla encendida mientras el componente esté montado. */
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        const wl = (navigator as Navigator & {
          wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> };
        }).wakeLock;
        if (!wl) return;
        lock = await wl.request("screen");
      } catch {
        /* el navegador puede rechazarlo */
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible" && !cancelled) request();
    };

    request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
    };
  }, [enabled]);
}
