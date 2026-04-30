/**
 * Lista los modelos de Gemini disponibles para tu API key.
 *
 * Útil cuando un modelo devuelve 404 (deprecado) o 429 (sin cuota free).
 *
 * Uso:
 *   node scripts/list-models.mjs
 *
 * Lee GEMINI_API_KEY desde:
 *   1) variable de entorno (si la exportaste)
 *   2) archivo .env.local
 *
 * Salida: lista de modelos que soportan generateContent con su descripción.
 */

import { readFile } from "node:fs/promises";

let apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  try {
    const envFile = await readFile(".env.local", "utf-8");
    const match = envFile.match(/^GEMINI_API_KEY\s*=\s*(.+)$/m);
    if (match) apiKey = match[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    // .env.local no existe → seguimos al check de abajo
  }
}

if (!apiKey || apiKey === "tu_key_aca") {
  console.error("Falta GEMINI_API_KEY.");
  console.error("  Definila en .env.local o exportala como env var.");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
console.log("→ GET /v1beta/models");

const res = await fetch(url);
const data = await res.json();

if (!res.ok) {
  console.error(`✗ ${res.status} ${res.statusText}`);
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

const models = (data.models || []).filter((m) =>
  (m.supportedGenerationMethods || []).includes("generateContent")
);

console.log(`← ${models.length} modelos soportan generateContent:\n`);
for (const m of models) {
  const name = m.name.replace(/^models\//, "");
  console.log(`  • ${name}`);
  if (m.displayName) console.log(`      ${m.displayName}`);
  if (m.description) {
    const short = m.description.split("\n")[0].slice(0, 100);
    console.log(`      ${short}`);
  }
  console.log();
}

console.log(
  "Para usar uno distinto del default, agregá GEMINI_MODEL=<nombre> a tu .env.local o a Vercel."
);
