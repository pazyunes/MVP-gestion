"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import {
  loadSession,
  updateSession,
  clearSession,
  type PedidoSession,
} from "@/lib/storage";
import {
  getProfesionalById,
  type Profesional,
} from "@/lib/profesionales";

/**
 * Pantalla 5 — Confirmación.
 *
 * Lee de sessionStorage el profesional elegido y el diagnóstico, genera
 * un código único de servicio (formato CHK-XXXXXX) y muestra el resumen
 * final con la garantía destacada.
 *
 * El código se persiste en la sesión para evitar regenerarlo si el
 * usuario refresca.
 */
export default function ConfirmacionPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<PedidoSession | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s || !s.profesionalId) {
      router.replace("/pedir");
      return;
    }
    // Si todavía no hay código, generamos uno y lo persistimos.
    if (!s.codigoServicio) {
      const updated = updateSession({ codigoServicio: generarCodigo() });
      if (updated) setSession(updated);
    } else {
      setSession(s);
    }
    setHydrated(true);
  }, [router]);

  const prof = useMemo<Profesional | undefined>(() => {
    if (!session?.profesionalId) return undefined;
    return getProfesionalById(session.profesionalId);
  }, [session]);

  function volverAlInicio() {
    clearSession();
    router.push("/");
  }

  if (!hydrated || !session || !prof) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 flex justify-center text-brand-muted">
          <Spinner size={28} />
        </main>
      </>
    );
  }

  const { diagnostico, form, codigoServicio } = session;
  const horaLlegada = prof.proximosHorarios[0];
  const costoPromedio = Math.round(
    (diagnostico.costo_estimado_min + diagnostico.costo_estimado_max) / 2
  );

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-12 animate-fade-in">
        {/* Hero de éxito */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-seafoam text-white shadow-soft mb-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
            Tu servicio fue confirmado
          </h1>
          <p className="mt-2 text-brand-muted">
            Te llega un mensaje cuando el profesional esté en camino.
          </p>
        </div>

        {/* Card de resumen */}
        <Card className="mt-8 p-6">
          <div className="flex items-center gap-4">
            <Image
              src={prof.foto}
              alt={`Foto de ${prof.nombre}`}
              width={64}
              height={64}
              className="rounded-2xl object-cover w-16 h-16 border border-brand-soft"
              unoptimized
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide text-brand-muted font-semibold">
                Profesional asignado
              </p>
              <p className="text-lg font-bold text-brand-dark truncate">
                {prof.nombre}
              </p>
              <p className="text-sm text-brand-muted">{prof.especialidad}</p>
            </div>
          </div>

          <dl className="mt-6 grid sm:grid-cols-2 gap-4">
            <SummaryItem
              label="Hora exacta de llegada"
              value={horaLlegada}
              accent
            />
            <SummaryItem
              label="Costo estimado"
              value={formatARS(costoPromedio)}
              hint={`${formatARS(diagnostico.costo_estimado_min)} – ${formatARS(diagnostico.costo_estimado_max)}`}
            />
            <SummaryItem
              label="Dirección"
              value={form.direccion || "(no especificada)"}
            />
            <SummaryItem
              label="A nombre de"
              value={form.nombre || "(no especificado)"}
            />
          </dl>

          <div className="mt-6 pt-5 border-t border-brand-soft text-center">
            <p className="text-xs uppercase tracking-wide text-brand-muted font-semibold">
              Código de servicio
            </p>
            <p className="mt-1 text-2xl font-mono font-extrabold text-brand-teal tracking-widest">
              {codigoServicio}
            </p>
            <p className="mt-1 text-xs text-brand-muted">
              Guardalo. Lo vas a usar para hacer seguimiento.
            </p>
          </div>
        </Card>

        {/* Garantía destacada — card prominente con borde teal e ícono grande */}
        <Card className="mt-6 p-6 bg-white border-2 border-brand-teal shadow-soft">
          <div className="flex gap-4 items-start">
            <span
              className="shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-soft text-brand-teal"
              aria-hidden="true"
            >
              <ShieldCheckLargeIcon />
            </span>
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-brand-dark">
                Garantía Check
              </h2>
              <p className="mt-1.5 text-sm text-brand-text leading-relaxed">
                Si el problema no se resuelve,{" "}
                <strong className="text-brand-teal">
                  mandamos otro profesional sin costo
                </strong>
                . Tu tranquilidad es nuestra prioridad.
              </p>
            </div>
          </div>
        </Card>

        {/* Próximos pasos */}
        <div className="mt-6 rounded-2xl bg-brand-soft/60 border border-brand-teal/20 p-5">
          <h3 className="text-sm font-bold text-brand-dark">
            Qué sigue ahora
          </h3>
          <ol className="mt-3 space-y-2 text-sm text-brand-text">
            <Step n={1}>
              Te llega un mensaje cuando {prof.nombre.split(" ")[0]} esté en
              camino.
            </Step>
            <Step n={2}>
              Verifica el problema en el lugar y te confirma el costo final.
            </Step>
            <Step n={3}>
              Pagás solo si aceptás. Toda la operación queda registrada con tu
              código <strong>{codigoServicio}</strong>.
            </Step>
          </ol>
        </div>

        <Button
          variant="secondary"
          size="lg"
          className="w-full mt-8"
          onClick={volverAlInicio}
        >
          Volver al inicio
        </Button>
      </main>

      <Footer />
    </>
  );
}

/* ─────────── helpers ─────────── */

function generarCodigo(): string {
  // 6 caracteres alfanuméricos en mayúsculas, ej: CHK-K9F3X2
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I para legibilidad
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CHK-${out}`;
}

function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function SummaryItem({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-brand-muted font-semibold">
        {label}
      </dt>
      <dd
        className={`mt-1 font-bold ${accent ? "text-xl text-brand-teal" : "text-brand-dark"}`}
      >
        {value}
      </dd>
      {hint && <dd className="text-xs text-brand-muted">{hint}</dd>}
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-brand-teal text-white text-xs font-bold inline-flex items-center justify-center">
        {n}
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function ShieldCheckLargeIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
