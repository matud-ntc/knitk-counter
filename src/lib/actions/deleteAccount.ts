"use server";

import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";

/**
 * Elimina la cuenta del usuario actual y todos sus datos (proyectos, secciones,
 * sesiones, tokens del watch). Requerido por App Store (5.1.1(v)).
 */
export async function deleteAccount() {
  const session = await getUserSession();
  if (!session?.user) {
    return { ok: false, error: "No hay sesión." };
  }
  const userId = session.user.id;

  await prisma.$transaction([
    prisma.section.deleteMany({ where: { project: { userId } } }),
    prisma.project.deleteMany({ where: { userId } }),
    prisma.watchPairingCode.deleteMany({ where: { userId } }),
    prisma.watchToken.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.account.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return { ok: true };
}
