import type { DiagnosticoResult } from "./types";

/**
 * Persistencia liviana entre pantallas usando sessionStorage.
 *
 * Como el MVP no tiene base de datos ni autenticación, guardamos en el
 * navegador todo el contexto del pedido en curso para que las pantallas
 * /diagnostico, /profesionales y /confirmacion puedan leerlo.
 *
 * sessionStorage se limpia al cerrar la pestaña → ideal para una demo
 * "un pedido a la vez".
 */

const KEY = "check_pedido";

/** Datos del formulario de la pantalla 2. */
export interface PedidoForm {
  nombre: string;
  direccion: string;
  rangoHorario: string;
  descripcion: string;
}

/** Snapshot completo del flujo. */
export interface PedidoSession {
  form: PedidoForm;
  /** data URL de la foto (incluye prefijo `data:image/...`) — usado para preview. */
  fotoDataUrl: string | null;
  /** Resultado parseado del endpoint /api/diagnose. */
  diagnostico: DiagnosticoResult;
  /** Id del profesional elegido en pantalla 4 (lo setea esa pantalla). */
  profesionalId?: string;
  /** Código de servicio generado en pantalla 5. */
  codigoServicio?: string;
}

export function saveSession(session: PedidoSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): PedidoSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PedidoSession;
  } catch {
    return null;
  }
}

export function updateSession(patch: Partial<PedidoSession>): PedidoSession | null {
  const current = loadSession();
  if (!current) return null;
  const next = { ...current, ...patch };
  saveSession(next);
  return next;
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
