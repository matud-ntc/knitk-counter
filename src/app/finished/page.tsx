import { getAllProjectsForUser } from "@/lib/actions/projectActions";
import { getUserSession } from "@/lib/session";
import ClientHome from "@/components/project/ClientHome";

export default async function CompletedProjectsPage() {
  const session = await getUserSession();
  if (!session?.user) return null;

  const allProjects = await getAllProjectsForUser(session.user.id);
  const completed = allProjects.filter((p) => p.isFinished);

  return <ClientHome projects={completed} showCompleted />;
}
