import { getAllProjectsForUser } from "@/lib/actions/projectActions";
import { getUserSession } from "@/lib/session";
import ClientHome from "@/components/project/ClientHome";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default async function HomePage() {
  const session = await getUserSession();

  if (!session?.user) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-between px-8 pb-12 pt-24 max-w-md mx-auto">
        {/* glow detrás del logo */}
        <div
          className="pointer-events-none absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2"
          style={{
            background:
              "radial-gradient(circle, var(--halo), transparent 62%)",
            opacity: 0.7,
          }}
        />

        <div className="relative flex flex-1 flex-col items-center justify-center gap-6">
          <Logo size={108} />
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
              Knitk Counter
            </h1>
            <p className="mt-1 text-[17px] font-medium text-[var(--muted-fg)]">
              Tu contador de filas de tejido
            </p>
          </div>
        </div>

        <div className="relative w-full flex flex-col gap-3">
          <a
            href="/api/auth/signin/google"
            className="flex h-[58px] items-center justify-center gap-3 rounded-[18px] knit-surface shadow-soft text-[17px] font-bold text-[var(--foreground)] active:scale-95 transition"
          >
            <GoogleIcon />
            Continuar con Google
          </a>

          <Link
            href="/quick"
            className="flex h-[52px] items-center justify-center gap-2 text-base font-semibold text-[var(--color-primary)] active:scale-95 transition"
          >
            <span className="font-display text-xl leading-none">+</span>
            Contador rápido
          </Link>
        </div>
      </main>
    );
  }

  const allProjects = await getAllProjectsForUser(session.user.id);
  const active = allProjects.filter((p) => !p.isFinished);

  return <ClientHome projects={active} showCompleted={false} />;
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
