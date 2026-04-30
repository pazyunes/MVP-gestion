import type { Config } from "tailwindcss";

/**
 * Configuración de Tailwind con la paleta de marca de Check.
 * Cada color tiene un nombre semántico para que el código sea legible.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidad de marca
        "brand-teal": "#028090",        // Primary teal
        "brand-dark": "#01535C",        // Primary dark teal
        "brand-seafoam": "#00A896",     // Secondary seafoam
        "brand-coral": "#F96167",       // Accent coral

        // Fondos
        "brand-bg": "#F7FAFB",          // Light background
        "brand-soft": "#E0F2F1",        // Soft teal

        // Texto
        "brand-text": "#1E293B",        // Dark text
        "brand-muted": "#94A3B8",       // Muted gray
      },
      fontFamily: {
        // Stack del sistema con Inter como preferida (cargada en layout.tsx).
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        // Sombra suave para cards de servicios y profesionales.
        soft: "0 4px 20px -6px rgba(2, 128, 144, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
