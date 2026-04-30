import { NextResponse } from "next/server";

/**
 * GET /api/sample-image?id=plomeria|electricidad|otro
 *
 * Proxy del lado servidor que descarga una foto de Unsplash y la devuelve
 * como base64 + mimeType. Sirve para alimentar el botón "Cargar foto de
 * ejemplo" en /pedir sin pelearse con CORS.
 *
 * Si una URL queda 404 con el tiempo, podés reemplazar el ID en SAMPLES.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mapping id → URL pública. Pueden cambiarse por cualquier imagen JPG/PNG
 * accesible públicamente.
 */
const SAMPLES: Record<string, string> = {
  plomeria:
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1024&q=70",
  electricidad:
    "https://images.unsplash.com/photo-1558389186-438424b00a48?w=1024&q=70",
  otro:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1024&q=70",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";

  const url = SAMPLES[id];
  if (!url) {
    return NextResponse.json(
      {
        error: `id desconocido. Valores válidos: ${Object.keys(SAMPLES).join(", ")}`,
      },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return NextResponse.json(
        { error: `La fuente de la imagen devolvió ${r.status}.` },
        { status: 502 }
      );
    }
    const buf = Buffer.from(await r.arrayBuffer());
    const mimeType = r.headers.get("content-type") ?? "image/jpeg";
    return NextResponse.json({
      base64: buf.toString("base64"),
      mimeType,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "No se pudo descargar la imagen de ejemplo.", detail: message },
      { status: 502 }
    );
  }
}
