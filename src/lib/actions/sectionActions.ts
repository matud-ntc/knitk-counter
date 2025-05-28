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
