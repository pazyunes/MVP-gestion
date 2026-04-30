"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import type { DiagnosticoResult } from "@/lib/types";
import { saveSession } from "@/lib/storage";

/**
 * Pantalla 2 — Pedir un servicio.
 *
 * Form con foto (preview), descripción, datos del usuario y rango horario.
 * Al darle "Analizar con IA" llama a /api/diagnose con la imagen en base64
 * y la descripción, guarda el resultado en sessionStorage y navega a
 * /diagnostico.
 *
 * Es Client Component porque maneja estado, FileReader y navegación
 * imperativa.
 */
export default function PedirPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado del formulario.
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // data URL para <img>
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);   // base64 limpio
  const [photoMimeType, setPhotoMimeType] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rangoHorario, setRangoHorario] = useState("");

  // Estado de la llamada a la IA.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Habilitamos "Analizar con IA" solo cuando hay foto + descripción.
  // Nombre, dirección y rango horario son opcionales para no frenar la demo.
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

    // FileReader nos da una data URL completa (data:image/...;base64,XXXX).
    // Guardamos la URL completa para el <img> y solo el base64 para el API.
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

      // Guardamos todo el contexto del pedido en sessionStorage para que
      // las pantallas siguientes (3, 4, 5) puedan consumirlo.
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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
          Pedir un servicio
        </h1>
        <p className="mt-2 text-brand-muted">
          Subí una foto del problema y contanos qué pasa. Hacemos un primer
          diagnóstico antes de mandar al profesional.
        </p>

        {/* Banner de transparencia: el usuario tiene que saber que es IA real */}
        <div className="mt-6 rounded-xl bg-brand-soft border border-brand-teal/30 p-4 text-sm text-brand-dark flex gap-3">
          <span aria-hidden="true" className="text-base leading-none mt-0.5">
            🤖
          </span>
          <p>
            <strong>Transparencia:</strong> el diagnóstico inicial lo hace una
            IA real (Google Gemini) analizando tu foto y descripción. Es una
            estimación; el profesional confirma todo en el lugar.
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
            hint="Cuanto más específico, mejor diagnostica la IA."
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

          {/* Rango horario */}
          <Field label="Rango horario preferido" htmlFor="rango">
            <select
              id="rango"
              value={rangoHorario}
              onChange={(e) => setRangoHorario(e.target.value)}
              className="mt-2 w-full rounded-xl border border-brand-soft bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="">Lo antes posible</option>
              <option value="manana">Mañana (8 a 12 h)</option>
              <option value="tarde">Tarde (12 a 18 h)</option>
              <option value="noche">Noche (18 a 22 h)</option>
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

          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            className="w-full"
          >
            {loading ? (
              <>
                <Spinner /> Analizando con IA...
              </>
            ) : (
              <>Analizar con IA</>
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

/* ───── helpers de UI locales ───── */

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

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 00-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
