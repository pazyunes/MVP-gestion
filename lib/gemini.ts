import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DiagnosticoResult, Rubro, Urgencia } from "./types";

/**
 * Cliente de Google Gemini para Check.
 *
 * Expone una sola función `diagnose()` que recibe una foto en base64 + una
 * descripción y devuelve un `DiagnosticoResult` ya tipado y validado.
 *
 * IMPORTANTE: este archivo se ejecuta solo en el servidor (lo importa
 * `app/api/diagnose/route.ts`). Nunca exponer GEMINI_API_KEY al cliente.
 */

/**
 * System prompt que le marca a Gemini cómo tiene que responder.
 * Lo mantenemos como constante para que sea fácil de auditar/ajustar.
 */
const SYSTEM_PROMPT = `Sos el sistema de diagnóstico de Check, una plataforma de servicios para el hogar. Analizás fotos y descripciones de problemas domésticos y devolvés un diagnóstico estructurado en JSON.

Reglas:
- Solo identificás problemas de plomería o electricidad (en esta versión inicial). Si el problema es de otro rubro, indicá que aún no está cubierto.
- Tu respuesta debe ser SIEMPRE un JSON válido con esta estructura:
{
  "rubro": "plomeria" | "electricidad" | "no_cubierto",
  "urgencia": "alta" | "media" | "baja",
  "costo_estimado_min": number (en pesos argentinos),
  "costo_estimado_max": number (en pesos argentinos),
  "descripcion_problema": "string corta describiendo qué se ve",
  "recomendaciones": "string con 1-2 recomendaciones para el usuario mientras espera al profesional"
}
- Sé claro y directo. No inventes información que no se puede ver en la foto.
- Si la foto no muestra un problema doméstico claro, devolvé rubro 'no_cubierto' y explicá brevemente.`;

/**
 * Modelo a usar. `gemini-2.0-flash` es rápido y barato y soporta visión.
 * Si en el aula la cuenta gratuita no tuviera acceso, cambiar a
 * "gemini-1.5-flash" — la API es 100% compatible.
 */
const MODEL_NAME = "gemini-2.0-flash";

const VALID_RUBROS: Rubro[] = ["plomeria", "electricidad", "no_cubierto"];
const VALID_URGENCIAS: Urgencia[] = ["alta", "media", "baja"];

/** Cacheamos el cliente para no recrear el SDK en cada request. */
let cachedClient: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY no está configurada. Definila en .env.local o en las Environment Variables de Vercel."
    );
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenerativeAI(apiKey);
  }
  return cachedClient;
}

/**
 * Llama a Gemini con la foto + descripción y devuelve el diagnóstico parseado.
 * Lanza Error si Gemini no responde o si el JSON no es válido.
 */
export async function diagnose(params: {
  imageBase64: string;
  mimeType: string;
  description: string;
}): Promise<DiagnosticoResult> {
  const client = getClient();

  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      // Forzamos a Gemini a devolver JSON puro (sin markdown ni texto extra).
      responseMimeType: "application/json",
      // Temperatura baja: queremos respuestas reproducibles y estructuradas,
      // no creatividad.
      temperature: 0.4,
    },
  });

  const userPrompt = `Descripción del usuario: ${
    params.description.trim() || "(sin descripción)"
  }

Por favor analizá la imagen adjunta y devolvé el diagnóstico en formato JSON.`;

  const result = await model.generateContent([
    { text: userPrompt },
    {
      inlineData: {
        data: params.imageBase64,
        mimeType: params.mimeType,
      },
    },
  ]);

  const raw = result.response.text();
  return parseAndValidate(raw);
}

/**
 * Parsea la respuesta de Gemini y valida que cumpla nuestro contrato.
 * Aunque pidamos `responseMimeType: application/json`, agregamos lógica
 * defensiva por si el modelo devuelve markdown o texto extra.
 */
function parseAndValidate(raw: string): DiagnosticoResult {
  let cleaned = raw.trim();

  // 1) Sacar fences ```json ... ``` si vinieran.
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
  }

  // 2) Si hay texto antes/después del objeto, quedarse con el primer { ... }.
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `La IA no devolvió un JSON válido. Respuesta cruda (recortada): ${raw.slice(
        0,
        300
      )}`
    );
  }

  // 3) Validar campos críticos.
  const rubro = parsed.rubro as Rubro;
  const urgencia = parsed.urgencia as Urgencia;

  if (!VALID_RUBROS.includes(rubro)) {
    throw new Error(`Rubro inválido devuelto por la IA: ${String(rubro)}`);
  }
  if (!VALID_URGENCIAS.includes(urgencia)) {
    throw new Error(
      `Urgencia inválida devuelta por la IA: ${String(urgencia)}`
    );
  }

  // 4) Coerce numérico y string para resistir respuestas levemente fuera de tipo.
  return {
    rubro,
    urgencia,
    costo_estimado_min: Number(parsed.costo_estimado_min) || 0,
    costo_estimado_max: Number(parsed.costo_estimado_max) || 0,
    descripcion_problema: String(parsed.descripcion_problema ?? ""),
    recomendaciones: String(parsed.recomendaciones ?? ""),
  };
}
