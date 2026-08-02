# EX·TRON — Desarrollo de software con precio cerrado

Sitio web de EX·TRON: estudio de desarrollo en Medellín. Next.js 14 App Router, multilenguaje (ES/EN), cotizador interactivo, panel admin y blog con CMS.

## Stack

- **Next.js 14** (App Router, SSR/SEO, ISR)
- **Tailwind CSS** — estilo minimalista blanco/negro/gris
- **NextAuth v4** — autenticación del panel admin (`/admin`)
- **Resend** — envío real de mensajes del formulario de contacto
- **Sanity** — CMS del blog (con fallback a contenido local)
- **lucide-react** — iconografía

## Estructura

```
app/            rutas: /, /blog, /blog/[slug], /admin, /admin/login, /studio, /api/*
components/     componentes UI (Navbar, Hero, QuoteCalculator, Contact...)
lib/            i18n (es/en), auth, sanity, posts fallback
sanity/         schema del CMS
```

## Requisitos

- Node.js 18+
- Variables de entorno (ver `.env.example`): `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `REVALIDATE_TOKEN`

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
```

## Producción

```bash
npm run build
npm start
```

Deploy recomendado en Vercel: importar el repo, definir las variables de entorno y listo.
