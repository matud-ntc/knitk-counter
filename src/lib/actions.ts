import { prisma } from "./prisma";
import { Project, Section } from "@prisma/client";

export async function getProjects(): Promise<(Project & { sections: Section[] })[]> {
  return prisma.project.findMany({
    include: {
      sections: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
