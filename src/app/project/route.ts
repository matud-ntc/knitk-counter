import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectName, sections } = await req.json();

  const project = await prisma.project.create({
    data: {
      name: projectName,
      userId: session.user.id,
      sections: {
        create: sections.map((s: any, index: number) => ({
          name: s.name,
          totalRows: s.totalRows ?? null,
          totalStitches: s.totalStitches ?? null,
          isFreeform: s.isFreeform,
          order: index,
        })),
      },
    },
  });

  return NextResponse.json({ success: true, id: project.id });
}
