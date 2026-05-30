import { getAllProjectsForUser } from "@/lib/actions/projectActions";
import { getUserSession } from "@/lib/session";
import ClientHome from "@/components/project/ClientHome";
import Link from "next/link";

export default async function HomePage() {
  const session = await getUserSession();

  if (!session?.user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-pink-500">Knitk Counter</h1>
          <p className="text-gray-500 text-sm">Tu contador de filas de tejido</p>
        </div>

        <div className="w-full max-w-xs flex flex-col gap-3">
          <a
            href="/api/auth/signin/google"
            className="flex items-center justify-center gap-3 w-full py-3 px-5 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg active:scale-95 transition-all text-gray-700 font-semibold text-base"
          >
            <GoogleIcon />
            Continuar con Google
          </a>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <Link
            href="/quick"
            className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-2xl border border-pink-300 text-pink-500 font-semibold text-base hover:bg-pink-50 active:scale-95 transition-all"
          >
            ⚡ Contador rápido
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
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
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
