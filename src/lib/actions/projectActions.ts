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

// Marcar proyecto como finalizado
export async function finishProject(projectId: string, path: string) {
  await prisma.project.update({
    where: { id: projectId },
    data: { isFinished: true },
  });

  revalidatePath(path);
}

// Crear una nueva sección
export async function addSection(
  projectId: string,
  name: string,
  totalRows?: number,
) {
  const count = await prisma.section.count({
    where: { projectId },
  });

  await prisma.section.create({
    data: {
      projectId,
      name,
      totalRows,
      order: count, // o count + 1 si querés que empiece en 1
    },
  });

  revalidatePath(`/project/${projectId}`);
}

// Editar una sección existente
export async function editSection(
  sectionId: string,
  name: string,
  totalRows?: number,
) {
  const section = await prisma.section.update({
    where: { id: sectionId },
    data: {
      name,
      totalRows,
    },
    include: { project: true },
  });

  revalidatePath(`/project/${section.projectId}`);
}

export async function editProjectName(projectId: string, newName: string) {
  await prisma.project.update({
    where: { id: projectId },
    data: { name: newName },
  });
  revalidatePath(`/project/${projectId}`);
}