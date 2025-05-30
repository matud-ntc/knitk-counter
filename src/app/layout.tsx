import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["400", "600", "700"],
});
export const metadata: Metadata = {
  title: "Knitk Counter",
  description: "Contador de puntos",
  manifest: "/manifest.json",
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={quicksand.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta id="theme-color" name="theme-color" content="#f97362" />
      </head>
      <body className={`${quicksand.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
