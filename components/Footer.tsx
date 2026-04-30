import { Logo } from "./Logo";

/**
 * Footer global. Incluye info del equipo (placeholder) y un disclaimer
 * de que es un MVP académico.
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-soft bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <Logo size="sm" />
          <p className="mt-3 text-sm text-brand-muted max-w-xs">
            MVP académico de una plataforma para resolver problemas del hogar
            con profesionales verificados y diagnóstico por IA.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-text">Equipo</h3>
          <ul className="mt-3 space-y-1 text-sm text-brand-muted">
            <li>María Paz Yunes</li>
            <li>Universidad — Materia Gestión</li>
            <li>Año 2026</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-text">Información</h3>
          <ul className="mt-3 space-y-1 text-sm text-brand-muted">
            <li>Proyecto educativo (MVP)</li>
            <li>Diagnóstico con Google Gemini</li>
            <li>Datos de profesionales mockeados</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-soft py-4 text-center text-xs text-brand-muted">
        © 2026 Check. Trabajo práctico universitario.
      </div>
    </footer>
  );
}
