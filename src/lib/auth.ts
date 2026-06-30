import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { prisma } from "./prisma";

const appleEnabled = !!(process.env.APPLE_ID && process.env.APPLE_SECRET);
const prod = process.env.NODE_ENV === "production";

// Apple responde con un POST cross-site (response_mode=form_post). Con SameSite=Lax
// el navegador no manda las cookies del flujo (pkce/state/nonce) en ese POST y el
// login falla. Por eso, en producción, esas cookies van con SameSite=None; Secure.
const crossSite = { httpOnly: true, sameSite: "none" as const, path: "/", secure: true };
const appleCookies = prod
  ? {
      pkceCodeVerifier: { name: "__Secure-next-auth.pkce.code_verifier", options: crossSite },
      state: { name: "__Secure-next-auth.state", options: crossSite },
      nonce: { name: "__Secure-next-auth.nonce", options: crossSite },
    }
  : undefined;

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  cookies: appleCookies,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Sign in with Apple (App Store 4.8). Se activa al definir APPLE_ID
    // (Services ID) y APPLE_SECRET (JWT firmado con la key) en el entorno.
    ...(appleEnabled
      ? [
          AppleProvider({
            clientId: process.env.APPLE_ID!,
            clientSecret: process.env.APPLE_SECRET!,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
};
