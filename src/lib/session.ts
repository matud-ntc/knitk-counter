import { getServerSession, type Session } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

/**
 * Auth mock para desarrollo: con `npm run dev` no hace falta loguear con
 * Google, entrás directo como un usuario de prueba. Se desactiva en
 * producción (Google real) o si exportás DISABLE_DEV_AUTH=1 para ver el
 * landing de login.
 */
const DEV_AUTH =
  process.env.NODE_ENV !== "production" && process.env.DISABLE_DEV_AUTH !== "1";

const DEV_EMAIL = "dev@knitk.local";
let cachedDevId: string | null = null;

async function seedDevProjects(userId: string) {
  const count = await prisma.project.count({ where: { userId } });
  if (count > 0) return;

  await prisma.project.create({
    data: {
      name: "Sweater lana merino",
      userId,
      sections: {
        create: [
          { name: "Espalda", totalRows: 120, completedRows: 75, order: 0 },
          { name: "Frente", totalRows: 120, completedRows: 47, order: 1 },
          { name: "Manga izq.", totalRows: 90, completedRows: 0, order: 2 },
          { name: "Cuello", isFreeform: true, completedRows: 12, order: 3 },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      name: "Bufanda nórdica",
      userId,
      sections: {
        create: [{ name: "Cuerpo", totalRows: 200, completedRows: 76, order: 0 }],
      },
    },
  });
  await prisma.project.create({
    data: {
      name: "Gorro trenzado",
      userId,
      isFinished: true,
      sections: {
        create: [{ name: "Vuelta", totalRows: 60, completedRows: 60, order: 0 }],
      },
    },
  });
}

async function getDevSession(): Promise<Session> {
  if (!cachedDevId) {
    const user = await prisma.user.upsert({
      where: { email: DEV_EMAIL },
      update: {},
      create: { email: DEV_EMAIL, name: "Tejedora dev" },
    });
    cachedDevId = user.id;
    await seedDevProjects(user.id);
  }
  return {
    user: { id: cachedDevId, name: "Tejedora dev", email: DEV_EMAIL },
    expires: "9999-12-31T23:59:59.999Z",
  } as Session;
}

export async function getUserSession() {
  if (DEV_AUTH) return getDevSession();
  return getServerSession(authOptions);
}
