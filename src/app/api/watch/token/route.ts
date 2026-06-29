import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken } from "@/lib/watchAuth";

// El Watch canjea el código de 6 dígitos por un token de larga duración.
export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({}));
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const record = await prisma.watchPairingCode.findUnique({
    where: { code: String(code).trim() },
  });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });
  }

  const token = generateToken();
  await prisma.watchToken.create({
    data: { tokenHash: hashToken(token), userId: record.userId },
  });
  // Código de un solo uso.
  await prisma.watchPairingCode.delete({ where: { code: record.code } });

  return NextResponse.json({ token });
}
