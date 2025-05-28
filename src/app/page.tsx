import { getProjectsForUser } from "@/lib/actions/projectActions";
import { getUserSession } from "@/lib/session";
import Link from "next/link";

export default async function HomePage() {
  const session = await getUserSession();

  if (!session?.user) {
    return (
      <main className="px-4 py-8 max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          🧶 Knitk Counter
        </h1>
        <a
          href="/api/auth/signin"
          className="bg-pink-500 text-white py-3 px-6 rounded-xl hover:bg-pink-600 inline-block"
        >
          Iniciar sesión con Google
        </a>
      </main>
    );
  }

  const projects = await getProjectsForUser(session.user.id);

  return (
    <main className="px-4 py-8 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">Mis proyectos</h1>
        <a href="/api/auth/signout" className="text-sm text-gray-600 underline">
          Cerrar sesión
        </a>
      </div>

      <Link href="/new">
        <button className="w-full bg-pink-500 text-white text-lg py-3 rounded-xl shadow-md hover:bg-pink-600">
          ➕ Nuevo proyecto
        </button>
      </Link>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No tenés proyectos todavía.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => {
            const total = project.sections.reduce(
              (acc, s) => acc + (s.totalRows ?? 0),
              0,
            );
            const completed = project.sections.reduce(
              (acc, s) => acc + s.completedRows,
              0,
            );
            const progress =
              total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <li key={project.id}>
                <Link href={`/project/${project.id}`}>
                  <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer space-y-2">
                    <div className="font-semibold text-lg text-gray-800">
                      {project.name}
                    </div>
                    <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {progress}% completado
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
