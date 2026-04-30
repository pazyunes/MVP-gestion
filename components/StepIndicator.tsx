/**
 * StepIndicator — barra de progreso del flujo (Pantallas 2, 3, 4).
 *
 * Layout:
 *   PASO X DE 4 — <Etiqueta>
 *   ▰▰▰▰▰▰  ▱▱▱▱▱▱  ▱▱▱▱▱▱  ▱▱▱▱▱▱
 *
 * Las barras `current` quedan en brand-teal; el resto en brand-soft.
 */

const LABELS: Record<number, string> = {
  1: "Foto y descripción",
  2: "Diagnóstico",
  3: "Elegí profesional",
  4: "Confirmación",
};

export function StepIndicator({
  current,
  total = 4,
}: {
  current: 1 | 2 | 3 | 4;
  total?: number;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-brand-teal uppercase tracking-wide">
          Paso {current} de {total}
        </span>
        <span className="text-xs text-brand-muted">{LABELS[current]}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < current ? "bg-brand-teal" : "bg-brand-soft"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
