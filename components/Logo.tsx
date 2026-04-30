/**
 * Logo de Check.
 * Diseño simple basado en un check (✓) dentro de un círculo teal,
 * acompañado del wordmark. Pensado para el header y el footer.
 */
export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const textCls =
    size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className="flex items-center gap-2">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="12" fill="#028090" />
        <path
          d="M11 21.5L17 27L29 14"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`${textCls} font-extrabold tracking-tight text-brand-dark`}>
        Check
      </span>
    </div>
  );
}
