import { Logo } from "./Logo";

/**
 * Footer global. Brand description + equipo.
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-soft bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-2">
        <div>
          <Logo size="sm" />
          <p className="mt-3 text-sm text-brand-muted max-w-xs">
            Resolvé los problemas de tu casa con profesionales verificados,
            hora exacta de llegada y garantía sobre el trabajo.
          </p>
        </div>

        <div className="md:text-right">
          <h3 className="text-sm font-semibold text-brand-text">Equipo</h3>
          <ul className="mt-3 space-y-1 text-sm text-brand-muted">
            <li>Juana Lambertucci</li>
            <li>Maria Paz Yunes</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-soft py-4 text-center text-xs text-brand-muted">
        © 2026 Check. Todos los derechos reservados.
      </div>
    </footer>
  );
}
