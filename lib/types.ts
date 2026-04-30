/**
 * Tipos compartidos entre el cliente de Gemini, el endpoint y la UI.
 *
 * Tener un único lugar donde vive la "forma" del diagnóstico evita que
 * el frontend y el backend se desincronicen.
 */

/** Rubros que cubre el MVP. `no_cubierto` es el fallback que devuelve la IA. */
export type Rubro = "plomeria" | "electricidad" | "no_cubierto";

/** Niveles de urgencia que reporta la IA. */
export type Urgencia = "alta" | "media" | "baja";

/**
 * Forma exacta del JSON que devuelve `/api/diagnose`.
 * Coincide 1:1 con el contrato del system prompt de Gemini.
 */
export interface DiagnosticoResult {
  rubro: Rubro;
  urgencia: Urgencia;
  costo_estimado_min: number;
  costo_estimado_max: number;
  descripcion_problema: string;
  recomendaciones: string;
}
