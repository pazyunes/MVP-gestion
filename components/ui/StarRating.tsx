/**
 * StarRating — render visual de una puntuación.
 * Soporta medias estrellas usando un overlay con clip via width%.
 * Ej: rating={4.7} → 4 estrellas llenas + 70% de la 5ta.
 */
export function StarRating({
  rating,
  max = 5,
  size = 16,
  showNumber = true,
}: {
  rating: number;
  max?: number;
  size?: number;
  showNumber?: boolean;
}) {
  const safe = Math.min(Math.max(rating, 0), max);
  const fillPct = (safe / max) * 100;

  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={`${safe.toFixed(1)} de ${max} estrellas`}
    >
      <span className="relative inline-block" style={{ height: size }}>
        {/* Capa base (gris) */}
        <span className="flex text-brand-muted/40">
          {Array.from({ length: max }).map((_, i) => (
            <Star key={i} size={size} />
          ))}
        </span>
        {/* Capa coloreada con clip por width */}
        <span
          className="absolute inset-0 flex text-yellow-400 overflow-hidden"
          style={{ width: `${fillPct}%` }}
          aria-hidden="true"
        >
          {Array.from({ length: max }).map((_, i) => (
            <Star key={i} size={size} />
          ))}
        </span>
      </span>
      {showNumber && (
        <span className="text-xs font-semibold text-brand-text">
          {safe.toFixed(1)}
        </span>
      )}
    </span>
  );
}

function Star({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
