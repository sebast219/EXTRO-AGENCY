import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import '../../globals.css'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/components/LanguageProvider'
import { LOCALES, isLocale, alternatesFor, SITE_URL, type Locale } from '@/lib/i18n/config'
import { safeJsonLd } from '@/lib/seo/json-ld'

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
    title: 'EXTRO — Agencia de Ingeniería de Software',
    description:
      'Agenda una llamada de 15 minutos. Cotizamos tu proyecto con precio fijo, primera entrega en 7 días y avances semanales. Garantía de 1 a 3 meses según el nivel del proyecto.',
    ogDescription:
      'Cotiza tu proyecto y continúa evolucionándolo con un plan mensual. Avances semanales, precio fijo y garantía de 1 a 3 meses.',
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
    title: 'EXTRO — Software Engineering Studio',
    description:
      'Book a 15-minute call. We scope your project at a fixed price, with a first delivery in 7 days and weekly progress. A 1 to 3 month guarantee depending on the project level.',
    ogDescription:
      'Get your project scoped and keep evolving it with a monthly plan. Weekly progress, fixed price and a 1 to 3 month guarantee.',
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
    authors: [{ name: 'EXTRO Engineering Studio' }],
    alternates: alternatesFor('/', lang),
    openGraph: {
      title: copy.title,
      description: copy.ogDescription,
      type: 'website',
      locale: copy.locale,
      url: alternatesFor('/', lang).canonical,
      siteName: 'EXTRO',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: copy.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.ogDescription,
      images: ['/og.png'],
    },
    robots: { index: true, follow: true },
    icons: { icon: '/icon.png', apple: '/apple-touch-icon.png' },
  }
}

const organizationSchema = (lang: Locale) => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  name: 'EXTRO',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  inLanguage: lang,
  description:
    lang === 'en'
      ? 'Software engineering studio. Get your project scoped at a fixed price; after delivery, keep evolving it with a monthly plan and weekly shipped progress. A 1 to 3 month guarantee depending on the project level.'
      : 'Agencia de ingeniería de software. Cotiza tu proyecto con precio fijo; después de la entrega, sigue evolucionándolo con un plan mensual y avances semanales en producción. Garantía de 1 a 3 meses según el nivel del proyecto.',
  email: 'hola@extro.com.co',
  telephone: '+573005865312',
  address: { '@type': 'PostalAddress', addressLocality: 'Medellín', addressCountry: 'CO' },
  geo: { '@type': 'GeoCoordinates', latitude: 6.2442, longitude: -75.5812 },
  areaServed: { '@type': 'Country', name: 'Colombia' },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  sameAs: ['https://github.com/sebast219', 'https://www.linkedin.com/in/sebastian-yepes-dev/'],
})

const websiteSchema = (lang: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EXTRO',
  url: SITE_URL,
  inLanguage: lang,
})

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
      </body>
    </html>
  )
}
