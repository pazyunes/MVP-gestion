# Check — MVP

Plataforma para resolver problemas del hogar (plomería y electricidad en este MVP) **sin incertidumbre**. Trabajo práctico universitario.

**Diferenciales:**
1. **Diagnóstico por IA** al subir una foto del problema (Google Gemini con visión).
2. **Profesionales con verificación fuerte.**
3. **Hora exacta de llegada** (no franjas).
4. **Garantía**: si el problema no se resuelve, mandamos otro profesional sin costo.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** con paleta de marca custom
- **Google Gemini** (`@google/generative-ai`) — modelo `gemini-2.5-flash` con visión
- Estado entre pantallas con `sessionStorage` (sin BD, sin auth)
- Despliegue en **Vercel**

## Flujo de la app

```
/  ──► /pedir ──► /api/diagnose (Gemini) ──► /diagnostico ──► /profesionales ──► /confirmacion
                                                  └─► caso "no_cubierto" termina ahí
```

## Estructura del proyecto

```
/app
  page.tsx                 → Pantalla 1: Home / Landing
  /pedir/page.tsx          → Pantalla 2: Foto + descripción + datos
  /diagnostico/page.tsx    → Pantalla 3: Resultado de la IA
  /profesionales/page.tsx  → Pantalla 4: Lista filtrada por rubro
  /confirmacion/page.tsx   → Pantalla 5: Resumen + código + garantía
  /api/diagnose/route.ts   → Endpoint Gemini (POST foto+desc → JSON)
  /api/sample-image/route.ts → Proxy de fotos demo (evita CORS)

/components
  Header.tsx, Footer.tsx, Logo.tsx, StepIndicator.tsx
  /ui
    Button.tsx       → variantes primary/secondary/ghost/coral, soporta href o onClick
    Card.tsx         → wrapper con sombra suave consistente
    Badge.tsx        → 6 colores semánticos (teal/coral/gray/red/yellow/green)
    Spinner.tsx      → loader que hereda currentColor
    StarRating.tsx   → puntuación visual con medias estrellas

/lib
  types.ts          → DiagnosticoResult, Rubro, Urgencia (única fuente de verdad)
  gemini.ts         → cliente Gemini + system prompt + parser defensivo
  storage.ts        → save/load/update/clear sessionStorage
  profesionales.ts  → 6 profesionales mockeados + helpers de filtrado

/scripts
  test-diagnose.mjs → smoke test del endpoint sin UI
  list-models.mjs   → lista modelos disponibles para tu API key (debug)
```

## Correr en local

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Configurar la API key de Gemini.** Es gratis:

   - Conseguir una en https://aistudio.google.com/app/apikey (Google Account → Create API key)
   - Copiar el archivo de ejemplo:
     ```bash
     cp .env.example .env.local
     ```
   - Editar `.env.local` y reemplazar `tu_key_aca` por la API key real

3. **Levantar el servidor:**

   ```bash
   npm run dev
   ```

   Abrir http://localhost:3000

## Probar el endpoint sin UI

Útil para verificar que la API key funciona antes de tocar la web.

**Script Node incluido:**

```bash
node scripts/test-diagnose.mjs ./prueba.jpg "La canilla pierde agua"
```

**Listar modelos disponibles para tu key** (si Gemini devuelve 404 / 429):

```bash
node scripts/list-models.mjs
```

**Códigos de respuesta del endpoint:**

| Código | Cuándo |
|---|---|
| `200` | Diagnóstico OK |
| `400` | Body inválido o faltan campos |
| `500` | `GEMINI_API_KEY` no configurada |
| `502` | Gemini falló o devolvió JSON inválido |

## Desplegar en Vercel

1. Subir el repo a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importar el repo.
3. **Antes de hacer deploy**, expandir **Environment Variables** y agregar:

   | Key | Value |
   |---|---|
   | `GEMINI_API_KEY` | tu API key real (la misma que pusiste en `.env.local`) |

   Marcar Production / Preview / Development. (Opcional: `GEMINI_MODEL=gemini-2.5-flash` para forzar un modelo específico sin tocar código.)

4. **Deploy.** En 1-2 min queda en `https://<proyecto>.vercel.app`.

> Si más adelante cambiás la API key, actualizala en *Project → Settings → Environment Variables* y forzá un **Redeploy** desde la pestaña **Deployments**.

## Paleta de colores

| Token Tailwind | HEX | Uso |
|---|---|---|
| `brand-teal` | #028090 | CTA primario, links |
| `brand-dark` | #01535C | Hover de primario, headings, banner garantía |
| `brand-seafoam` | #00A896 | Acento secundario, hero check |
| `brand-coral` | #F96167 | Acciones destacadas, badge electricidad |
| `brand-bg` | #F7FAFB | Fondo general |
| `brand-soft` | #E0F2F1 | Fondos suaves, hover, badges teal |
| `brand-text` | #1E293B | Texto principal |
| `brand-muted` | #94A3B8 | Texto secundario |

## Manejo de estado entre pantallas

Como no hay BD ni autenticación, el flujo se persiste con **`sessionStorage`** vía `lib/storage.ts`:

- Sobrevive a navegaciones entre páginas y a refresh.
- Se limpia al cerrar la pestaña o al apretar **"Volver al inicio"** desde la confirmación.
- Cada pantalla tiene un guard: si entrás directo sin haber hecho los pasos previos, te redirige a `/pedir`.

## Estado del MVP

- [x] Pantalla 1 — Home / Landing
- [x] Pantalla 2 — Pedir un servicio (con dropdown de fotos demo)
- [x] Pantalla 3 — Resultado del diagnóstico (incluye caso `no_cubierto`)
- [x] Pantalla 4 — Profesionales recomendados
- [x] Pantalla 5 — Confirmación con código y garantía
- [x] Endpoint `/api/diagnose` con Gemini
- [x] Endpoint `/api/sample-image` (proxy demo)
- [x] Datos mockeados de 6 profesionales

## Limitaciones conocidas (para honestidad académica)

- **Sin autenticación**: cualquiera puede usar el flujo. No hay multi-usuario.
- **Sin persistencia real**: el pedido vive en sessionStorage, se pierde al cerrar la pestaña.
- **Profesionales mockeados**: matching y disponibilidad son estáticos en `lib/profesionales.ts`.
- **Cuota Gemini**: el tier gratuito de `gemini-2.5-flash` es ~10 req/min y 250/día. Suficiente para una demo, no para producción.
- **Tamaño de foto**: Vercel limita el body a ~4.5 MB. Fotos de cámara muy grandes pueden fallar (futuro: resize client-side).
