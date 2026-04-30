import { NextResponse } from "next/server";
import { diagnose } from "@/lib/gemini";

/**
 * POST /api/diagnose
 *
 * Recibe una foto en base64 + descripción y devuelve el diagnóstico
 * estructurado de Gemini (ver `lib/types.ts → DiagnosticoResult`).
 *
 * Body esperado (JSON):
 * {
 *   "image": "<base64 sin prefijo data:>",  // también acepta data URL completa
 *   "mimeType": "image/jpeg",
 *   "description": "string libre del usuario"
 * }
 *
 * Respuestas:
 * - 200: DiagnosticoResult
 * - 400: body inválido o campos faltantes
 * - 500: GEMINI_API_KEY mal configurada en el server
 * - 502: Gemini falló o devolvió algo no parseable
 */

// Forzamos runtime Node (el SDK de Gemini usa libs de Node).
export const runtime = "nodejs";
// Evita que Next intente cachear esta ruta.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 1. Parsear body como JSON. Si no es JSON, error claro.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El body tiene que ser JSON válido." },
      { status: 400 }
    );
  }

  // 2. Extraer y validar campos.
  const { image, mimeType, description } =
    (body as Record<string, unknown>) ?? {};

  if (typeof image !== "string" || image.length === 0) {
    return NextResponse.json(
      { error: "Falta el campo 'image' (string base64 o data URL)." },
      { status: 400 }
    );
  }
  if (typeof mimeType !== "string" || !mimeType.startsWith("image/")) {
    return NextResponse.json(
      {
        error:
          "Falta el campo 'mimeType' o no es válido (ej: image/jpeg, image/png).",
      },
      { status: 400 }
    );
  }
  if (typeof description !== "string") {
    return NextResponse.json(
      { error: "Falta el campo 'description' (string)." },
      { status: 400 }
    );
  }

  // 3. Si el cliente envió un data URL completo ("data:image/jpeg;base64,..."),
  //    nos quedamos solo con la parte base64.
  const cleanBase64 = image.includes(",") ? image.split(",")[1] : image;

  // 4. Llamar a Gemini.
  try {
    const result = await diagnose({
      imageBase64: cleanBase64,
      mimeType,
      description,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/diagnose] error:", message);

    // Error de configuración (key faltante) → 500
    if (message.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        {
          error:
            "El servidor no tiene configurada GEMINI_API_KEY. Revisá las variables de entorno.",
        },
        { status: 500 }
      );
    }

    // Cualquier otro error (red, JSON inválido, modelo caído) → 502
    return NextResponse.json(
      {
        error: "No se pudo obtener el diagnóstico de la IA.",
        detail: message,
      },
      { status: 502 }
    );
  }
}
