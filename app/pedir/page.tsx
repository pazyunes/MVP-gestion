"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { DiagnosticoResult } from "@/lib/types";
import { saveSession } from "@/lib/storage";

/**
 * Pantalla 2 — Pedir un servicio.
 *
 * Form con foto (preview), descripción, datos del usuario y rango horario.
 * Al darle "Analizar" llama a /api/diagnose, guarda el resultado en
 * sessionStorage y navega a /diagnostico.
 */
export default function PedirPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado del formulario.
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rangoHorario, setRangoHorario] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slots de hora exacta calculados en cliente para evitar mismatch de hidratación.
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  useEffect(() => {
    setTimeSlots(generateTimeSlots(new Date()));
  }, []);

  // El botón "Analizar" se habilita solo cuando hay foto + descripción.
  const canSubmit =
    !!photoBase64 && descripcion.trim().length > 0 && !loading;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo tiene que ser una imagen (jpg/png/webp).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhotoPreview(dataUrl);
      setPhotoBase64(dataUrl.split(",")[1] ?? "");
      setPhotoMimeType(file.type);
    };
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    setPhotoPreview(null);
    setPhotoBase64(null);
    setPhotoMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !photoBase64 || !photoMimeType) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photoBase64,
          mimeType: photoMimeType,
          description: descripcion,
        }),
      });

      if (!res.ok) {
        const errBody = await res
          .json()
          .catch(() => ({ error: `Error ${res.status}` }));
        throw new Error(errBody.error || `Error ${res.status}`);
      }

      const diagnostico: DiagnosticoResult = await res.json();

      saveSession({
        form: { nombre, direccion, rangoHorario, descripcion },
        fotoDataUrl: photoPreview,
        diagnostico,
      });

      router.push("/diagnostico");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Algo salió mal. Probá de nuevo.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-12 animate-fade-in">
        <StepIndicator current={1} />

        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
          Pedir un servicio
        </h1>
        <p className="mt-2 text-brand-muted">
          Contanos qué pasa. Hacemos un primer diagnóstico antes de mandar al
          profesional.
        </p>

        {/* Mensaje de transparencia de costo — responde al hallazgo "miedo a que te claven" */}
        <div className="mt-6 rounded-2xl bg-white border border-brand-coral/30 px-4 py-3 flex gap-3 shadow-soft/50">
          <span className="shrink-0 mt-0.5 text-brand-coral" aria-hidden="true">
            <DollarSignIcon />
          </span>
          <p className="text-sm text-brand-text leading-relaxed">
            <strong className="text-brand-dark">Sin sorpresas:</strong> vas a
            ver el rango de costo estimado antes de confirmar nada. La IA
            analiza la foto y te da una estimación realista basada en el
            problema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Foto + preview */}
          <div>
            <label className="block text-sm font-semibold text-brand-text">
              Foto del problema <span className="text-brand-coral">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Subir foto del problema"
            />

            {!photoPreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 w-full border-2 border-dashed border-brand-teal/40 rounded-2xl py-10 px-4 text-center hover:bg-brand-soft/50 transition-colors"
              >
                <div className="text-3xl mb-2" aria-hidden="true">
                  📷
                </div>
                <p className="font-semibold text-brand-teal">
                  Subí una foto del problema
                </p>
                <p className="text-xs text-brand-muted mt-1">
                  En mobile podés sacarla con la cámara directamente
                </p>
              </button>
            ) : (
              <div className="mt-2 relative rounded-2xl overflow-hidden border border-brand-soft bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Vista previa de la foto subida"
                  className="w-full max-h-80 object-contain"
                />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-lg shadow-soft hover:bg-white"
                >
                  Cambiar foto
                </button>
              </div>
            )}
          </div>

          {/* Descripción */}
          <Field
            label="Descripción del problema"
            required
            htmlFor="descripcion"
          >
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              placeholder="Ej: La canilla de la cocina pierde agua desde anoche, no para de gotear."
              className="mt-2 w-full rounded-xl border border-brand-soft bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </Field>

          {/* Nombre */}
          <Field label="Tu nombre" htmlFor="nombre">
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="María García"
              className="mt-2 w-full rounded-xl border border-brand-soft bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </Field>

          {/* Dirección */}
          <Field label="Dirección" htmlFor="direccion">
            <input
              id="direccion"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Av. Corrientes 1234, CABA"
              className="mt-2 w-full rounded-xl border border-brand-soft bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </Field>

          {/* Hora exacta — responde al hallazgo "la hora exacta es diferencial" */}
          <Field
            label="¿Cuándo te viene mejor?"
            htmlFor="rango"
            hint="Te confirmamos la hora exacta de llegada del profesional, no una franja amplia."
          >
            <select
              id="rango"
              value={rangoHorario}
              onChange={(e) => setRangoHorario(e.target.value)}
              className="mt-2 w-full rounded-xl border border-brand-soft bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="">Lo antes posible</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </Field>

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          {/* Banner de Garantía Check — refuerzo de confianza pre-submit */}
          <div className="rounded-2xl bg-brand-soft border border-brand-teal/30 px-4 py-3 flex gap-3">
            <span
              className="shrink-0 mt-0.5 text-brand-teal"
              aria-hidden="true"
            >
              <ShieldCheckIcon />
            </span>
            <p className="text-sm text-brand-dark leading-relaxed">
              <strong>Garantía Check:</strong> si el problema no se resuelve,
              mandamos otro profesional sin costo.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            className="w-full"
          >
            {loading ? (
              <>
                <Spinner /> Analizando…
              </>
            ) : (
              <>Analizar</>
            )}
          </Button>

          {!canSubmit && !loading && (
            <p className="text-xs text-brand-muted text-center">
              Cargá una foto y la descripción para habilitar el análisis.
            </p>
          )}
        </form>
      </main>

      <Footer />
    </>
  );
}

/* ───── helpers locales ───── */

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-brand-text"
      >
        {label}
        {required && <span className="text-brand-coral"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-brand-muted">{hint}</p>}
    </div>
  );
}

/**
 * Genera 6 slots horarios consecutivos de hora en hora a partir de la hora
 * actual, dentro de la franja laboral 09–20.
 * - Si la hora actual es ≥ 20, salta entera al día siguiente.
 * - Si la franja de hoy se agota (>20), continúa al día siguiente desde 09:00.
 */
function generateTimeSlots(now: Date): string[] {
  const WORK_START = 9;
  const WORK_END = 20; // último slot que se ofrece hoy
  const SLOTS = 6;

  const slots: string[] = [];
  let day: "Hoy" | "Mañana" = "Hoy";
  let hour = now.getHours() + 1;

  if (now.getHours() >= WORK_END || hour > WORK_END) {
    day = "Mañana";
    hour = WORK_START;
  } else if (hour < WORK_START) {
    hour = WORK_START;
  }

  while (slots.length < SLOTS) {
    if (hour > WORK_END) {
      day = "Mañana";
      hour = WORK_START;
    }
    slots.push(`${day} ${String(hour).padStart(2, "0")}:00`);
    hour++;
  }

  return slots;
}

function ShieldCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DollarSignIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
