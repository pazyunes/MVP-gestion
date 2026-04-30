import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Botón reutilizable de Check.
 *
 * Soporta tres variantes visuales y opcionalmente actuar como Link de Next
 * (cuando recibe `href`) o como <button> nativo.
 *
 * Variantes:
 * - primary: teal sólido, CTA principal
 * - secondary: outline en teal, acción secundaria
 * - coral: acento coral, para acciones destacadas (ej: "Confirmar servicio")
 */

type Variant = "primary" | "secondary" | "ghost" | "coral";
type Size = "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-teal disabled:opacity-50 disabled:cursor-not-allowed";

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-teal text-white hover:bg-brand-dark shadow-soft hover:shadow-lg",
  secondary:
    "bg-white text-brand-teal border-2 border-brand-teal hover:bg-brand-soft",
  ghost:
    "bg-transparent text-brand-teal hover:bg-brand-soft",
  coral:
    "bg-brand-coral text-white hover:brightness-95 shadow-soft hover:shadow-lg",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type ButtonAsButton = CommonProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
  } = props;

  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  // Si tiene href => Link de Next (navegación cliente).
  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props as ButtonAsLink;
    return (
      <Link href={href} className={finalClasses} {...rest}>
        {children}
      </Link>
    );
  }

  // Caso <button> nativo.
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={finalClasses} {...rest}>
      {children}
    </button>
  );
}
