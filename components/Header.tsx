import Link from "next/link";
import { Logo } from "./Logo";

/**
 * Header global. Mostramos el logo y un link de "Pedir servicio"
 * que se mantiene visible en mobile y desktop.
 */
export function Header() {
  return (
    <header className="w-full border-b border-brand-soft bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" aria-label="Ir al inicio">
          <Logo />
        </Link>
        <Link
          href="/pedir"
          className="text-sm font-semibold text-brand-teal hover:text-brand-dark"
        >
          Pedir servicio →
        </Link>
      </div>
    </header>
  );
}
