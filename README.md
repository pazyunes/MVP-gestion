# Check — MVP

Plataforma para resolver problemas del hogar (plomería y electricidad en esta primera versión) sin incertidumbre. Trabajo práctico universitario.

**Diferenciales:**
1. Diagnóstico por IA al subir una foto del problema (Google Gemini).
2. Profesionales con verificación fuerte.
3. Hora exacta de llegada.
4. Garantía: si el problema no se resuelve, mandamos otro profesional sin costo.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** con paleta de marca custom
- **Google Gemini** (`@google/generative-ai`) — modelo `gemini-2.0-flash` con vision
- Despliegue en **Vercel**

## Estructura

```
/app
  page.tsx                 → Pantalla 1: Home/Landing
  /pedir/page.tsx          → Pantalla 2: Formulario de pedido (próximo paso)
  /diagnostico/page.tsx    → Pantalla 3: Resultado IA (próximo paso)
  /profesionales/page.tsx  → Pantalla 4: Recomendaciones (próximo paso)
  /confirmacion/page.tsx   → Pantalla 5: Confirmación (próximo paso)
  /api/diagnose/route.ts   → Endpoint Gemini (próximo paso)
/components
  /ui/Button.tsx           → Botón reutilizable (variants: primary, secondary, coral)
  Header.tsx, Footer.tsx, Logo.tsx
/lib
  profesionales.ts         → Datos mockeados (próximo paso)
  gemini.ts                → Cliente de Gemini (próximo paso)
```

## Correr en local

1. **Clonar** e instalar dependencias:

   ```bash
   npm install
   ```

2. **Configurar la API key** de Gemini:

   - Conseguir una key gratis en https://aistudio.google.com/app/apikey
   - Copiar `.env.example` a `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Pegar la key en `GEMINI_API_KEY=...`

3. **Levantar el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

   Abrir http://localhost:3000

## Desplegar en Vercel

1. **Subir el código a GitHub** (repo público o privado).
2. Entrar a [vercel.com](https://vercel.com) y elegir **Add New → Project**.
3. Importar el repo de GitHub. Vercel detecta automáticamente que es Next.js.
4. **Antes de hacer deploy**, expandir la sección **Environment Variables** y agregar:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: la API key real de Gemini
   - Marcar los tres entornos (Production, Preview, Development).
5. Click en **Deploy**. En unos minutos queda online en una URL `https://<proyecto>.vercel.app`.

> ⚠️ Si más adelante cambiás la API key, actualizala en *Project → Settings → Environment Variables* y luego forzá un redeploy desde la pestaña **Deployments**.

## Paleta de colores

| Token Tailwind | HEX | Uso |
|---|---|---|
| `brand-teal` | #028090 | CTA primario, links |
| `brand-dark` | #01535C | Hover de primario, headings |
| `brand-seafoam` | #00A896 | Acento secundario |
| `brand-coral` | #F96167 | Acciones destacadas |
| `brand-bg` | #F7FAFB | Fondo general |
| `brand-soft` | #E0F2F1 | Fondos suaves, hover |
| `brand-text` | #1E293B | Texto principal |
| `brand-muted` | #94A3B8 | Texto secundario |

## Estado del MVP

- [x] Pantalla 1 — Home / Landing
- [ ] Pantalla 2 — Pedir un servicio
- [ ] Pantalla 3 — Resultado del diagnóstico
- [ ] Pantalla 4 — Profesionales recomendados
- [ ] Pantalla 5 — Confirmación
- [ ] Endpoint `/api/diagnose` con Gemini
- [ ] Datos mockeados de 6 profesionales
