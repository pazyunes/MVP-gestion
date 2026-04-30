/**
 * Smoke test del endpoint /api/diagnose sin pasar por la UI.
 *
 * Uso:
 *   node scripts/test-diagnose.mjs <ruta-imagen> [descripción]
 *
 * Ejemplo:
 *   node scripts/test-diagnose.mjs ./prueba.jpg "La canilla pierde agua"
 *
 * Variables opcionales:
 *   ENDPOINT  URL del endpoint (default: http://localhost:3000/api/diagnose)
 *
 * Requisitos:
 *   - El servidor de Next.js corriendo (`npm run dev`).
 *   - GEMINI_API_KEY configurada en .env.local.
 *   - Una imagen JPG/PNG/WebP a mano (puede ser cualquier foto de prueba).
 */

import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const ENDPOINT = process.env.ENDPOINT || "http://localhost:3000/api/diagnose";
const imagePath = process.argv[2];
const description =
  process.argv[3] || "Hay un problema en mi casa, no estoy seguro qué es.";

if (!imagePath) {
  console.error("Uso: node scripts/test-diagnose.mjs <ruta-imagen> [descripción]");
  console.error('Ej:  node scripts/test-diagnose.mjs ./prueba.jpg "canilla goteando"');
  process.exit(1);
}

const MIME_BY_EXT = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
};

const ext = extname(imagePath).toLowerCase().slice(1);
const mimeType = MIME_BY_EXT[ext];
if (!mimeType) {
  console.error(`Formato no soportado: .${ext}. Usá jpg, png o webp.`);
  process.exit(1);
}

const absPath = resolve(imagePath);
const buffer = await readFile(absPath);
const base64 = buffer.toString("base64");

console.log(`→ POST ${ENDPOINT}`);
console.log(`  imagen:      ${absPath}`);
console.log(`  tamaño:      ${(buffer.length / 1024).toFixed(1)} KB`);
console.log(`  mimeType:    ${mimeType}`);
console.log(`  descripción: "${description}"`);
console.log("");

const started = Date.now();
let res;
try {
  res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64, mimeType, description }),
  });
} catch (err) {
  console.error("✗ No se pudo conectar al endpoint:", err.message);
  console.error("  ¿Está corriendo `npm run dev`?");
  process.exit(2);
}

const elapsed = Date.now() - started;
const text = await res.text();

console.log(`← ${res.status} ${res.statusText}  (${elapsed} ms)`);
try {
  console.log(JSON.stringify(JSON.parse(text), null, 2));
} catch {
  // Si la respuesta no fue JSON, la imprimimos cruda.
  console.log(text);
}

process.exit(res.ok ? 0 : 1);
