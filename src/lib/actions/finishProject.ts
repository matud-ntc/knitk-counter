// src/actions/finishProject.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function finishProject(projectId: string) {
  await prisma.project.update({
    where: { id: projectId },
    data: { isFinished: true },
  });

  revalidatePath(`/project/${projectId}`);
}
