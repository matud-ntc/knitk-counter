import { getAllProjectsForUser } from "@/lib/actions/projectActions";
import { getUserSession } from "@/lib/session";
import ClientHome from "@/components/project/ClientHome";
import Logo from "@/components/ui/Logo";
import LoginButtons from "@/components/LoginButtons";

export default async function HomePage() {
  const session = await getUserSession();

  if (!session?.user) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-between px-8 pb-12 pt-[max(6rem,calc(env(safe-area-inset-top)_+_1rem))] max-w-md mx-auto">
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

        <LoginButtons
          appleEnabled={!!(process.env.APPLE_ID && process.env.APPLE_SECRET)}
        />
      </main>
    );
  }

  const allProjects = await getAllProjectsForUser(session.user.id);
  const active = allProjects.filter((p) => !p.isFinished);

  return <ClientHome projects={active} showCompleted={false} />;
}
