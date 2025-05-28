import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { projectName, sections } = body;

  const project = await prisma.project.create({
    data: {
      name: projectName,
      user: {
        connect: {
          id: session.user.id,
        },
      },
      sections: {
        create: sections.map((s: any, i: number) => ({
          name: s.name,
          totalRows: s.totalRows ?? null,
          totalStitches: s.totalStitches ?? null,
          isFreeform: s.isFreeform,
          order: i,
        })),
      },
    },
  });

  return NextResponse.json({ id: project.id });
}
