import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

// Obtener proyectos del usuario autenticado
export async function getProjectsForUser(userId: string) {
  return prisma.project.findMany({
    where: {
      userId,
      isFinished: false,
    },
    include: { sections: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function finishProject(projectId: string, path: string) {
  await prisma.project.update({
    where: { id: projectId },
    data: { isFinished: true },
  });

  revalidatePath(path);
}
