import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Knitk Counter",
  description: "Un contador de tejido cute 💖",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans antialiased bg-[#fefefe] text-[#111]`}>
        {children}
      </body>
    </html>
  );
}
