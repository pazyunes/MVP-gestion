import type { Metadata } from "next";
import "./globals.css";

/**
 * Metadata del sitio. Aparece en la pestaña del navegador y en
 * compartidos sociales (open graph básico).
 */
export const metadata: Metadata = {
  title: "Check — Servicios para tu casa sin incertidumbre",
  description:
    "Check es la plataforma que conecta hogares con profesionales verificados. Diagnóstico por IA, hora exacta de llegada y garantía sobre el trabajo.",
};

/**
 * Layout raíz de toda la aplicación.
 * - Carga la fuente Inter desde Google Fonts (link directo, sin next/font para
 *   mantener el setup simple de cara a la presentación).
 * - Aplica la clase font-sans (Tailwind) que usa Inter como tipografía principal.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen bg-brand-bg text-brand-text">
        {children}
      </body>
    </html>
  );
}
