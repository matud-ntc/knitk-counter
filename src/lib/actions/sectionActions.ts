"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Sumar punto
export async function addStitch(sectionId: string, path: string) {
  await prisma.section.update({
    where: { id: sectionId },
    data: { completedStitches: { increment: 1 } },
  });
  revalidatePath(path);
}

// Restar punto
export async function removeStitch(sectionId: string, path: string) {
  await prisma.section.update({
    where: { id: sectionId },
    data: {
      completedStitches: {
        decrement: 1,
      },
    },
  });
  revalidatePath(path);
}

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
