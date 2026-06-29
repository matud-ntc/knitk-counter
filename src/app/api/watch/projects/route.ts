import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWatchUserId } from "@/lib/watchAuth";

// Proyectos + secciones del usuario del token (forma que consume el Watch).
export async function GET(req: Request) {
  const userId = await getWatchUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId, isFinished: false },
    orderBy: { updatedAt: "desc" },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  const out = projects.map((p) => ({
    id: p.id,
    name: p.name,
    isFinished: p.isFinished,
    sections: p.sections.map((s) => ({
      id: s.id,
      name: s.name,
      notes: s.notes,
      totalRows: s.totalRows,
      completedRows: s.completedRows,
      isFreeform: s.isFreeform,
      order: s.order,
    })),
  }));

  return NextResponse.json(out);
}
