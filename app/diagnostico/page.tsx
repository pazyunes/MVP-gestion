"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeColor } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { loadSession, type PedidoSession } from "@/lib/storage";
import type { Rubro, Urgencia } from "@/lib/types";

/**
 * Pantalla 3 — Resultado del diagnóstico.
 *
 * Lee el resultado de Gemini desde sessionStorage y lo presenta en
 * formato visual: foto en grande, badges (rubro + urgencia), rango de
 * costo, descripción y recomendaciones.
 *
 * Si el rubro es `no_cubierto`, muestra una variante empática con un
 * formulario de notificación (mockeado, solo visual).
 *
 * Guard: si alguien entra directo sin haber pasado por /pedir, redirige.
 */
export default function DiagnosticoPage() {
  const router = useRouter();
  const [session, setSession] = useState<PedidoSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/pedir");
      return;
    }
    setSession(s);
    setHydrated(true);
  }, [router]);

  if (!hydrated || !session) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 flex justify-center text-brand-muted">
          <Spinner size={28} />
        </main>
      </>
    );
  }

  const { diagnostico, fotoDataUrl } = session;

  if (diagnostico.rubro === "no_cubierto") {
    return <NoCubiertoView fotoDataUrl={fotoDataUrl} descripcion={diagnostico.descripcion_problema} />;
  }

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-12 animate-fade-in">
        <StepIndicator current={2} />

        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
          Resultado del diagnóstico
        </h1>
        <p className="mt-2 text-brand-muted">
          Esto fue lo que detectó la IA a partir de tu foto y descripción.
        </p>

        {/* Foto */}
        {fotoDataUrl && (
          <div className="mt-6 rounded-2xl overflow-hidden border border-brand-soft shadow-soft bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoDataUrl}
              alt="Foto del problema reportado"
              className="w-full max-h-96 object-contain"
            />
          </div>
        )}

        {/* Card principal */}
        <Card className="mt-6 p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge color={rubroColor(diagnostico.rubro)} icon={<DotIcon />}>
              {rubroLabel(diagnostico.rubro)}
            </Badge>
            <Badge color={urgenciaColor(diagnostico.urgencia)}>
              Urgencia {diagnostico.urgencia}
            </Badge>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-brand-muted font-semibold">
              Costo estimado
            </p>
            <p className="mt-1 text-2xl md:text-3xl font-extrabold text-brand-dark">
              {formatARS(diagnostico.costo_estimado_min)} —{" "}
              {formatARS(diagnostico.costo_estimado_max)}
            </p>
          </div>

          <div className="mt-5 pt-5 border-t border-brand-soft">
            <p className="text-xs uppercase tracking-wide text-brand-muted font-semibold">
              Problema detectado
            </p>
            <p className="mt-2 text-brand-text leading-relaxed">
              {diagnostico.descripcion_problema}
            </p>
          </div>

          <div className="mt-5 pt-5 border-t border-brand-soft">
            <p className="text-xs uppercase tracking-wide text-brand-muted font-semibold">
              Recomendaciones mientras esperás
            </p>
            <p className="mt-2 text-brand-text leading-relaxed">
              {diagnostico.recomendaciones}
            </p>
          </div>
        </Card>

        {/* Botones */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button href="/profesionales" size="lg" className="w-full sm:flex-1">
            Ver profesionales recomendados →
          </Button>
          <Button
            href="/pedir"
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            Volver atrás
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ─────────── Caso especial: rubro no_cubierto ─────────── */

function NoCubiertoView({
  fotoDataUrl,
  descripcion,
}: {
  fotoDataUrl: string | null;
  descripcion: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-12 animate-fade-in">
        <StepIndicator current={2} />

        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
          Todavía no cubrimos este rubro
        </h1>
        <p className="mt-2 text-brand-muted">
          Por ahora Check funciona para problemas de plomería y electricidad.
          Estamos sumando rubros nuevos cada mes.
        </p>

        {fotoDataUrl && (
          <div className="mt-6 rounded-2xl overflow-hidden border border-brand-soft shadow-soft bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoDataUrl}
              alt="Foto del problema reportado"
              className="w-full max-h-72 object-contain"
            />
          </div>
        )}

        <Card className="mt-6 p-6">
          <div className="flex gap-2">
            <Badge color="gray">No cubierto</Badge>
          </div>
          <p className="mt-3 text-brand-text leading-relaxed">{descripcion}</p>
        </Card>

        <Card className="mt-6 p-6 bg-brand-soft/50 border-brand-teal/30">
          <h2 className="text-lg font-bold text-brand-dark">
            ¿Querés que te avisemos cuando esté disponible?
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Dejanos tu email y te escribimos apenas sumemos el rubro.
          </p>

          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-4 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 rounded-xl border border-brand-soft bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
              <Button type="submit" size="md">
                Avisame
              </Button>
            </form>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-white border border-brand-teal/30 text-sm text-brand-dark">
              ✅ Listo. Te avisamos a <strong>{email}</strong> apenas
              sumemos el rubro.
            </div>
          )}
        </Card>

        <div className="mt-8">
          <Button href="/" variant="secondary" size="lg" className="w-full">
            Volver al inicio
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ─────────── helpers ─────────── */

function rubroLabel(r: Rubro): string {
  return r === "plomeria"
    ? "Plomería"
    : r === "electricidad"
    ? "Electricidad"
    : "No cubierto";
}

function rubroColor(r: Rubro): BadgeColor {
  return r === "plomeria" ? "teal" : r === "electricidad" ? "coral" : "gray";
}

function urgenciaColor(u: Urgencia): BadgeColor {
  return u === "alta" ? "red" : u === "media" ? "yellow" : "green";
}

function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function DotIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-1.5 h-1.5 rounded-full bg-current"
    />
  );
}
