"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

/** Botones de login que van directo al proveedor (sin la página intermedia de next-auth). */
export default function LoginButtons({ appleEnabled }: { appleEnabled: boolean }) {
  return (
    <div className="relative flex w-full flex-col gap-3">
      {appleEnabled && (
        <button
          onClick={() => signIn("apple", { callbackUrl: "/" })}
          className="flex h-[58px] items-center justify-center gap-3 rounded-[18px] bg-black text-[17px] font-bold text-white active:scale-95 transition"
        >
          <AppleIcon />
          Continuar con Apple
        </button>
      )}

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex h-[58px] items-center justify-center gap-3 rounded-[18px] knit-surface text-[17px] font-bold text-[var(--foreground)] shadow-soft active:scale-95 transition"
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <Link
        href="/quick"
        className="flex h-[52px] items-center justify-center gap-2 text-base font-semibold text-[var(--color-primary)] active:scale-95 transition"
      >
        <span className="font-display text-xl leading-none">+</span>
        Contador rápido
      </Link>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
      <path
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        fill="#FFC107"
      />
      <path
        d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        fill="#FF3D00"
      />
      <path
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        fill="#4CAF50"
      />
      <path
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.533 44 30.031 44 24c0-1.341-.138-2.65-.389-3.917z"
        fill="#1976D2"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.7 2.2-3.99 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.11-1.66-.17-3.24.97-4.08.97-.84 0-2.14-.95-3.52-.92-1.81.03-3.48 1.05-4.41 2.67-1.88 3.26-.48 8.08 1.35 10.72.9 1.29 1.97 2.74 3.38 2.69 1.36-.06 1.87-.88 3.51-.88 1.64 0 2.1.88 3.53.85 1.46-.03 2.38-1.32 3.27-2.62 1.03-1.5 1.46-2.95 1.48-3.03-.03-.01-2.85-1.09-2.88-4.32zM14.39 4.2c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.36.71-3.13 1.61-.69.79-1.29 2.06-1.13 3.27 1.19.09 2.41-.6 3.16-1.48z" />
    </svg>
  );
}
