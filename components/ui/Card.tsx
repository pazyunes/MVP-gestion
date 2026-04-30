import type { HTMLAttributes, ReactNode } from "react";

/**
 * Card básico de Check.
 * Sombra suave consistente, fondo blanco, borde sutil en brand-soft.
 * Acepta cualquier prop de un <div>.
 */
export function Card({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-soft border border-brand-soft ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
