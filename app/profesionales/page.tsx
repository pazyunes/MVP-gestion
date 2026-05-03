"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { StarRating } from "@/components/ui/StarRating";
import {
  getProfesionalesByRubro,
  type Profesional,
} from "@/lib/profesionales";
import { loadSession, updateSession } from "@/lib/storage";
import type { Rubro } from "@/lib/types";

/**
 * Pantalla 4 — Profesionales recomendados.
 *
 * Lee el rubro detectado por la IA en sessionStorage y muestra los 3
 * profesionales mockeados de ese rubro. Al confirmar uno, guarda el id
 * en la sesión y navega a /confirmacion.
 *
 * Guards:
 * - Sin sesión → redirige a /pedir
 * - Sesión con rubro `no_cubierto` → redirige a /diagnostico (ahí se
 *   muestra la variante "no cubrimos este rubro")
 */
export default function ProfesionalesPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [rubro, setRubro] = useState<Rubro | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/pedir");
      return;
    }
    if (s.diagnostico.rubro === "no_cubierto") {
      router.replace("/diagnostico");
      return;
    }
    setRubro(s.diagnostico.rubro);
    setProfesionales(getProfesionalesByRubro(s.diagnostico.rubro));
    setHydrated(true);
  }, [router]);

  function confirmar(id: string) {
    updateSession({ profesionalId: id });
    router.push("/confirmacion");
  }

  if (!hydrated) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 flex justify-center text-brand-muted">
          <Spinner size={28} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-12 animate-fade-in">
        <StepIndicator current={3} />

        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
          Profesionales recomendados para vos
        </h1>
        <p className="mt-2 text-brand-muted max-w-xl">
          Filtramos por <strong>especialidad</strong> ({rubroLabel(rubro!)}),{" "}
          <strong>disponibilidad inmediata</strong> y{" "}
          <strong>puntuación</strong>. Estos son los 3 que más matchean.
        </p>

        <ul className="mt-8 grid gap-5">
          {profesionales.map((p) => (
            <ProfCard key={p.id} prof={p} onConfirm={() => confirmar(p.id)} />
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Button href="/diagnostico" variant="ghost" size="md">
            ← Volver al diagnóstico
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ─────────── Card de un profesional ─────────── */

function ProfCard({
  prof,
  onConfirm,
}: {
  prof: Profesional;
  onConfirm: () => void;
}) {
  return (
    <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <Image
          src={prof.foto}
          alt={`Foto de ${prof.nombre}`}
          width={72}
          height={72}
          className="rounded-2xl object-cover w-[72px] h-[72px] shrink-0 border border-brand-soft"
          unoptimized
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-brand-dark truncate">
              {prof.nombre}
            </h3>
            {prof.verificado && (
              <Badge color="teal" icon={<CheckIcon />}>
                Verificado
              </Badge>
            )}
            <Badge color="teal" icon={<ShieldIcon />}>
              Garantía Check
            </Badge>
          </div>
          <p className="text-sm text-brand-muted">{prof.especialidad}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-brand-muted">
            <StarRating rating={prof.puntuacion} />
            <span>·</span>
            <span>{prof.trabajosRealizados} trabajos</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-brand-soft/50 border border-brand-teal/20 px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-brand-muted font-semibold">
            Próximo horario
          </div>
          <div className="text-base font-bold text-brand-dark">
            {prof.proximosHorarios[0]}
          </div>
          <div className="text-xs text-brand-muted">
            También: {prof.proximosHorarios.slice(1).join(" · ")}
          </div>
        </div>
        <div className="rounded-xl bg-brand-soft/50 border border-brand-teal/20 px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-brand-muted font-semibold">
            Precio estimado
          </div>
          <div className="text-base font-bold text-brand-dark">
            {formatARS(prof.precioPorHora)} / hora
          </div>
          <div className="text-xs text-brand-muted">Tarifa de referencia</div>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full mt-4"
        onClick={onConfirm}
      >
        Confirmar servicio con {prof.nombre.split(" ")[0]}
      </Button>
    </Card>
  );
}

/* ─────────── helpers ─────────── */

function rubroLabel(r: Rubro): string {
  return r === "plomeria"
    ? "plomería"
    : r === "electricidad"
    ? "electricidad"
    : "no cubierto";
}

function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
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
  );
}

function ShieldIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
