import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import '../../globals.css'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/components/LanguageProvider'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { LOCALES, isLocale, alternatesFor, SITE_URL, type Locale } from '@/lib/i18n/config'
import { safeJsonLd } from '@/lib/seo/json-ld'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'
import { ogImageFor } from '@/lib/seo/social'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

/**
 * CSP nonce (proxy.ts) y rendering: el nonce solo se estampa en los <script>
 * cuando la página se renderiza por request (Next.js no inyecta nonces en
 * páginas prerenderizadas en build time — no hay headers ahí). Por eso cada
 * page.tsx bajo este layout declara `export const dynamic = 'force-dynamic'`
 * explícitamente por ruta, en vez de heredarlo aquí: así queda claro por
 * página qué se puede migrar a estático en el futuro sin tener que releer
 * este comentario para saber qué rutas dependen del nonce por petición.
 * El cuello de botella real (fetch a Sanity sin caché de datos) se resuelve
 * en `lib/content/posts.ts` con `unstable_cache`, no aquí.
 */

/**
 * viewport-fit=cover: permite que el contenido llegue bajo el notch y el home
 * indicator del iPhone; luego `env(safe-area-inset-*)` en elementos fijos
 * (WhatsAppFloat, footer) evita que queden tapados.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const COPY = {
  es: {
    title: 'EXTRO — Ingeniería de software a medida, en producción',
    description:
      'EXTRO es una empresa de ingeniería de software a medida. Precio fijo, primera entrega en 7 días y avances constantes en cada fase. El código es tuyo.',
    ogDescription:
      'Empresa de ingeniería de software a medida: en producción en 7 días, precio fijo y el código es tuyo desde el primer día.',
    locale: 'es_CO',
    skip: 'Saltar al contenido',
    keywords: [
      'agencia de software',
      'desarrollo de software',
      'agencia software Medellín',
      'suscripción ingeniería',
      'precio fijo',
      'Next.js',
    ],
  },
  en: {
    title: 'EXTRO — Custom Software Engineering, in Production',
    description:
      'EXTRO is a custom software engineering company. Fixed price, first delivery in 7 days and steady progress in every phase. The code is yours.',
    ogDescription:
      'Custom software engineering company: in production in 7 days, fixed price and the code is yours from day one.',
    locale: 'en_US',
    skip: 'Skip to content',
    keywords: [
      'software agency',
      'software development',
      'engineering subscription',
      'fixed price development',
      'Next.js',
    ],
  },
} satisfies Record<Locale, unknown> as Record<Locale, {
  title: string
  description: string
  ogDescription: string
  locale: string
  skip: string
  keywords: string[]
}>

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const copy = COPY[lang]

  return {
    metadataBase: new URL(SITE_URL),
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    authors: [{ name: 'EXTRO' }],
    alternates: alternatesFor('/', lang),
    openGraph: {
      title: copy.title,
      description: copy.ogDescription,
      type: 'website',
      locale: copy.locale,
      url: alternatesFor('/', lang).canonical,
      siteName: 'EXTRO',
      images: [{ url: ogImageFor(lang).url, width: 1200, height: 630, alt: copy.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.ogDescription,
      images: [ogImageFor(lang).url],
    },
    robots: { index: true, follow: true },
    // Search Console: etiqueta HTML. Si se verifica por DNS, la variable queda vacía.
    verification: process.env.NEXT_PUBLIC_GSC_TOKEN
      ? { google: process.env.NEXT_PUBLIC_GSC_TOKEN }
      : undefined,
    icons: { icon: '/icon.png', apple: '/apple-touch-icon.png' },
  }
}

/**
 * JSON-LD no es un script ejecutable, así que la CSP con nonce no lo bloquea.
 * Se marca el tipo explícitamente para que ningún navegador lo interprete.
 */
function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // M-2: el idioma se resuelve en el servidor a partir de la ruta. Antes salía
  // de un useEffect, de modo que el HTML siempre llegaba en español y el inglés
  // aparecía tras la hidratación — parpadeo para el usuario e invisible para el
  // buscador.
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  return (
    <html lang={lang} className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-ink focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          {COPY[lang].skip}
        </a>
        <LanguageProvider lang={lang}>{children}</LanguageProvider>
        <JsonLd data={organizationSchema(lang)} />
        <JsonLd data={websiteSchema(lang)} />
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
