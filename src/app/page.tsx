import { getProjects } from "@/lib/actions";
import Link from "next/link";

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🧶 Knitk Counter</h1>

      <Link href="/new">
        <button className="w-full bg-pink-400 text-white text-lg py-3 rounded-xl shadow-md mb-6 hover:bg-pink-500">
          ➕ Nuevo proyecto
        </button>
      </Link>

      <input
        type="text"
        placeholder="Buscar proyecto..."
        className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300"
      />

      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="p-4 bg-white rounded-lg shadow flex flex-col">
            <span className="font-semibold">{project.name}</span>
            <progress
              value={project.sections.reduce((acc, s) => acc + s.completedRows, 0)}
              max={project.sections.reduce((acc, s) => acc + (s.totalRows ?? 0), 0)}
              className="mt-2"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
