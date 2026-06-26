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

/** Vibración corta al sumar fila (respeta el ajuste). */
export function haptic(pattern: number | number[] = 8) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (!readSettings().vibrate) return;
  navigator.vibrate(pattern);
}

let audioCtx: AudioContext | null = null;

/** Tick suave de audio al sumar fila (respeta el ajuste). */
export function tick() {
  if (typeof window === "undefined") return;
  if (!readSettings().sound) return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!audioCtx) audioCtx = new AC();
    const ctx = audioCtx;
    // El contexto suele quedar "suspended" hasta el primer gesto; reactivar.
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch {
    /* ignore */
  }
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
