import type { Rubro } from "./types";

/**
 * Datos mockeados de profesionales para el MVP.
 *
 * En el demo se usan tal cual (sin BD). Las fotos vienen de pravatar.cc
 * — que ya está habilitado en `next.config.js → images.remotePatterns`.
 */

export interface Profesional {
  id: string;
  nombre: string;
  foto: string;
  especialidad: string;
  /** Solo cubrimos plomería y electricidad en este MVP. */
  rubro: Exclude<Rubro, "no_cubierto">;
  /** Puntuación entre 4.5 y 5.0. */
  puntuacion: number;
  trabajosRealizados: number;
  /** Hora exacta (no franja). El primero de la lista es el "próximo". */
  proximosHorarios: string[];
  /** Precio por hora en pesos argentinos. */
  precioPorHora: number;
  verificado: boolean;
}

export const PROFESIONALES: Profesional[] = [
  // ───────────────── Plomería ─────────────────
  {
    id: "plom-01",
    nombre: "Carlos Méndez",
    foto: "https://i.pravatar.cc/300?img=12",
    especialidad: "Plomería general y reparaciones",
    rubro: "plomeria",
    puntuacion: 4.9,
    trabajosRealizados: 287,
    proximosHorarios: ["Hoy 16:30", "Hoy 18:00", "Mañana 09:00"],
    precioPorHora: 12000,
    verificado: true,
  },
  {
    id: "plom-02",
    nombre: "Diego Ramírez",
    foto: "https://i.pravatar.cc/300?img=33",
    especialidad: "Cañerías y destapaciones",
    rubro: "plomeria",
    puntuacion: 4.7,
    trabajosRealizados: 156,
    proximosHorarios: ["Hoy 17:15", "Mañana 10:30", "Mañana 14:00"],
    precioPorHora: 10000,
    verificado: true,
  },
  {
    id: "plom-03",
    nombre: "Hugo Suárez",
    foto: "https://i.pravatar.cc/300?img=51",
    especialidad: "Termotanques y calefones",
    rubro: "plomeria",
    puntuacion: 5.0,
    trabajosRealizados: 412,
    proximosHorarios: ["Hoy 19:00", "Mañana 08:00", "Mañana 11:30"],
    precioPorHora: 14500,
    verificado: true,
  },
  // ───────────────── Electricidad ─────────────────
  {
    id: "elec-01",
    nombre: "Federico López",
    foto: "https://i.pravatar.cc/300?img=8",
    especialidad: "Instalaciones eléctricas y tableros",
    rubro: "electricidad",
    puntuacion: 4.8,
    trabajosRealizados: 198,
    proximosHorarios: ["Hoy 16:00", "Hoy 17:30", "Mañana 09:30"],
    precioPorHora: 11500,
    verificado: true,
  },
  {
    id: "elec-02",
    nombre: "Andrés Torres",
    foto: "https://i.pravatar.cc/300?img=15",
    especialidad: "Reparación de cortocircuitos",
    rubro: "electricidad",
    puntuacion: 4.6,
    trabajosRealizados: 134,
    proximosHorarios: ["Hoy 18:45", "Mañana 10:00", "Mañana 13:00"],
    precioPorHora: 10500,
    verificado: true,
  },
  {
    id: "elec-03",
    nombre: "Martín Rodríguez",
    foto: "https://i.pravatar.cc/300?img=68",
    especialidad: "Iluminación y artefactos",
    rubro: "electricidad",
    puntuacion: 4.9,
    trabajosRealizados: 263,
    proximosHorarios: ["Hoy 20:00", "Mañana 08:30", "Mañana 12:00"],
    precioPorHora: 13000,
    verificado: true,
  },
];

/** Filtra los profesionales que matchean el rubro detectado por la IA. */
export function getProfesionalesByRubro(rubro: Rubro): Profesional[] {
  if (rubro === "no_cubierto") return [];
  return PROFESIONALES.filter((p) => p.rubro === rubro);
}

/** Lookup por id (usado en /confirmacion). */
export function getProfesionalById(id: string): Profesional | undefined {
  return PROFESIONALES.find((p) => p.id === id);
}
