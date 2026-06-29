import crypto from "crypto";
import { prisma } from "./prisma";

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function generatePairingCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/**
 * Auth del Apple Watch: lee `Authorization: Bearer <token>`, busca el token
 * (hasheado) y devuelve el userId, o null si no es válido.
 */
export async function getWatchUserId(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const record = await prisma.watchToken.findUnique({
    where: { tokenHash: hashToken(match[1].trim()) },
  });
  if (!record) return null;

  prisma.watchToken
    .update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});

  return record.userId;
}
