"use server";

import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getUserSession } from "./session";

export async function createProjectWithSections(formData: FormData) {
  const session = await getUserSession();
  if (!session?.user) return;

  const name = formData.get("name") as string;
  const sectionName = formData.get("sectionName") as string;
  const totalRows = formData.get("totalRows")
    ? Number(formData.get("totalRows"))
    : null;
  const totalStitches = formData.get("totalStitches")
    ? Number(formData.get("totalStitches"))
    : null;
  const isFreeform = formData.get("isFreeform") === "on";

  await prisma.project.create({
    data: {
      name,
      user: {
        connect: {
          id: session.user.id,
        },
      },
      sections: {
        create: [
          {
            name: sectionName,
            totalRows,
            totalStitches,
            isFreeform,
            order: 0,
          },
        ],
      },
    },
  });

  return redirect("/");
}
