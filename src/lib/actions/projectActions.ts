import { prisma } from "../prisma";

// Obtener proyectos del usuario autenticado
export async function getProjectsForUser(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    include: { sections: true },
    orderBy: { createdAt: "desc" },
  });
}
