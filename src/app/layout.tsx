import type { Metadata, Viewport } from "next";
import { Baloo_2, Fredoka } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["400", "500", "600", "700", "800"],
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Knitk Counter",
  description: "Tu contador de filas de tejido",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Knitk Counter",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#EE7B5F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

// Aplica el tema guardado antes del primer paint para evitar el flash.
const themeScript = `
(function(){
  try {
    var valid = ["theme-salmon","theme-light","theme-dark","theme-mocha","theme-nord","theme-rose"];
    var t = localStorage.getItem("theme");
    document.body.className = "antialiased lana-bg " + ((t && valid.indexOf(t) !== -1) ? t : "theme-salmon");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${baloo.variable} ${fredoka.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased lana-bg theme-salmon min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
