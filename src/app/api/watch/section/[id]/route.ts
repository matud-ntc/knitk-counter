import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWatchUserId } from "@/lib/watchAuth";

// El Watch actualiza el contador de una sección (verifica pertenencia).
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getWatchUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const completedRows = Math.max(0, Math.floor(Number(body.completedRows)));
  if (!Number.isFinite(completedRows)) {
    return NextResponse.json({ error: "Bad value" }, { status: 400 });
  }

  const section = await prisma.section.findFirst({
    where: { id, project: { userId } },
  });
  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.section.update({
    where: { id },
    data: { completedRows },
  });

  return NextResponse.json({ id: updated.id, completedRows: updated.completedRows });
}
