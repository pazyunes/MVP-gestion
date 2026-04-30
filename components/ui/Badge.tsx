import type { ReactNode } from "react";

/**
 * Badge con variantes de color para distintos tipos de etiquetas:
 * - teal/coral: rubros (plomería/electricidad)
 * - red/yellow/green: niveles de urgencia (alta/media/baja)
 * - gray: estados neutros (no_cubierto)
 */

export type BadgeColor =
  | "teal"
  | "coral"
  | "gray"
  | "red"
  | "yellow"
  | "green";

const colorClasses: Record<BadgeColor, string> = {
  teal: "bg-brand-soft text-brand-dark border-brand-teal/40",
  coral: "bg-red-50 text-brand-coral border-brand-coral/40",
  gray: "bg-slate-100 text-slate-700 border-slate-300",
  red: "bg-red-50 text-red-700 border-red-200",
  yellow: "bg-yellow-50 text-yellow-800 border-yellow-200",
  green: "bg-green-50 text-green-700 border-green-200",
};

export function Badge({
  color = "gray",
  icon,
  children,
}: {
  color?: BadgeColor;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses[color]}`}
    >
      {icon}
      {children}
    </span>
  );
}
