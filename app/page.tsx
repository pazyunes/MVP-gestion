import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";

/**
 * Pantalla 1 — Home / Landing.
 *
 * Estructura:
 *  - Header global
 *  - Hero con el wordmark "Check" + tagline + CTA principal
 *  - Sección "Cómo funciona" con 3 bloques: IA, Verificación, Garantía
 *  - Sección secundaria con CTA repetido
 *  - Footer global
 *
 * Mobile-first: el grid de 3 columnas colapsa a 1 columna en pantallas chicas.
 */
export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* ───────── HERO ───────── */}
        <section className="relative overflow-hidden">
          {/* Fondo decorativo: gradiente suave en seafoam/teal */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-brand-soft via-white to-white"
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white text-brand-teal text-xs font-semibold tracking-wide uppercase shadow-soft">
              MVP — Servicios para el hogar
            </span>

            <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-brand-dark">
              Check
            </h1>

            <p className="mt-5 text-xl sm:text-2xl text-brand-text max-w-2xl mx-auto leading-snug">
              Resolvé los problemas de tu casa{" "}
              <span className="text-brand-teal font-semibold">
                sin incertidumbre
              </span>
              .
            </p>

            <p className="mt-4 text-base text-brand-muted max-w-xl mx-auto">
              Subí una foto, te decimos qué pasa y mandamos un profesional
              verificado a la hora exacta que necesitás.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button href="/pedir" size="lg">
                Pedir un servicio
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10h12m0 0l-4-4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <a
                href="#como-funciona"
                className="text-sm font-semibold text-brand-dark hover:text-brand-teal underline-offset-4 hover:underline"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>
        </section>

        {/* ───────── BLOQUES EXPLICATIVOS ───────── */}
        <section
          id="como-funciona"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
              Por qué Check es distinto
            </h2>
            <p className="mt-3 text-brand-muted max-w-xl mx-auto">
              Tres garantías que eliminan la incertidumbre típica de contratar
              servicios para el hogar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<IconBrain />}
              title="Diagnóstico con IA"
              description="Subí una foto del problema y nuestra IA identifica el rubro, la urgencia y el rango de costo en segundos."
            />
            <FeatureCard
              icon={<IconShield />}
              title="Profesionales verificados"
              description="Cada profesional pasa por una verificación fuerte: identidad, antecedentes y experiencia comprobada."
            />
            <FeatureCard
              icon={<IconClock />}
              title="Hora exacta y garantía"
              description="Te decimos exactamente a qué hora llega. Si el problema no se resuelve, mandamos otro sin costo."
            />
          </div>
        </section>

        {/* ───────── CTA SECUNDARIO ───────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-3xl bg-brand-dark text-white px-6 sm:px-12 py-12 md:py-16 text-center shadow-soft">
            <h2 className="text-2xl md:text-3xl font-bold">
              ¿Tenés un problema en casa ahora?
            </h2>
            <p className="mt-3 text-brand-soft/90 max-w-xl mx-auto">
              Empezá con una foto. En menos de un minuto sabés qué pasa, cuánto
              sale y quién lo puede resolver.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/pedir" variant="coral" size="lg">
                Pedir un servicio
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ────────────────────────────────────────────
   Subcomponentes locales (solo se usan acá).
   ──────────────────────────────────────────── */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-brand-soft hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-brand-soft text-brand-teal flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
      <p className="mt-2 text-sm text-brand-muted leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* Iconos SVG inline para no agregar dependencias. */

function IconBrain() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 4a3 3 0 00-3 3v1a3 3 0 00-2 5.83V15a3 3 0 003 3h1v1a3 3 0 006 0v-1h1a3 3 0 003-3v-1.17A3 3 0 0018 8V7a3 3 0 00-3-3 3 3 0 00-3 1.5A3 3 0 009 4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l8 3v6c0 4.5-3.5 8.5-8 9-4.5-.5-8-4.5-8-9V6l8-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
