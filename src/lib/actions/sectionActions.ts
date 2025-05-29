"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Sumar fila
export async function addRow(sectionId: string, path: string) {
  await prisma.section.update({
    where: { id: sectionId },
    data: {
      completedRows: {
        increment: 1,
      },
    },
  });
  revalidatePath(path);
}

// Restar fila (💡 esta parte es la que falta)
export async function removeRow(sectionId: string, path: string) {
  await prisma.section.update({
    where: { id: sectionId },
    data: {
      completedRows: {
        decrement: 1,
      },
    },
  });
  revalidatePath(path);
}

export async function addSection(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const totalRows = Number(formData.get("totalRows")) || undefined;

  const count = await prisma.section.count({ where: { projectId } });

  await prisma.section.create({
    data: {
      projectId,
      name,
      totalRows,
      order: count,
    },
  });

  revalidatePath(`/project/${projectId}`);
}

export async function editSection(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const totalRows = Number(formData.get("totalRows")) || undefined;

  const section = await prisma.section.update({
    where: { id },
    data: { name, totalRows },
    include: { project: true },
  });

  revalidatePath(`/project/${section.projectId}`);
}
