import { getAllProjectsForUser, getProjectsForUser } from "@/lib/actions/projectActions";
import { getUserSession } from "@/lib/session";
import ClientHome from "@/components/project/ClientHome";

export default async function HomePage() {
  const session = await getUserSession();

  if (!session?.user) {
    return (
      <main className="px-4 py-8 max-w-md mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          🧶 Knitk Counter
        </h1>
        <a
          href="/api/auth/signin"
          className="bg-pink-500 text-white py-3 px-6 rounded-xl hover:bg-pink-600 inline-block"
        >
          Iniciar sesión con Google
        </a>
        <div>
          <a
            href="/quick"
            className="text-pink-500 underline text-sm"
          >
            ⚡ Contador rápido
          </a>
        </div>
      </main>
    );
  }

  const allProjects = await getAllProjectsForUser(session.user.id);
const active = allProjects.filter((p) => !p.isFinished);

  return <ClientHome projects={active} showCompleted={false} />
}
