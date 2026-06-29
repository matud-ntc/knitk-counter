import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";
import { generatePairingCode } from "@/lib/watchAuth";

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutos

// La web (logueada) genera un código de 6 dígitos para emparejar el Watch.
export async function POST() {
  const session = await getUserSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Invalidar códigos previos del usuario y los vencidos.
  await prisma.watchPairingCode.deleteMany({
    where: { OR: [{ userId: session.user.id }, { expiresAt: { lt: new Date() } }] },
  });

  let code = generatePairingCode();
  for (let i = 0; i < 5; i++) {
    const clash = await prisma.watchPairingCode.findUnique({ where: { code } });
    if (!clash) break;
    code = generatePairingCode();
  }

  const expiresAt = new Date(Date.now() + CODE_TTL_MS);
  await prisma.watchPairingCode.create({
    data: { code, userId: session.user.id, expiresAt },
  });

  return NextResponse.json({ code, expiresAt });
}
