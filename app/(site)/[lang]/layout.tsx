import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Inter, Space_Grotesk } from 'next/font/google'
import '../../globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'
import { LOCALES, isLocale, alternatesFor, SITE_URL, type Locale } from '@/lib/i18n/config'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['500', '600', '700'],
  display: 'swap',
})

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

/**
 * CSP nonce (proxy.ts) y rendering: el nonce solo se estampa en los <script>
 * cuando la página se renderiza por request (Next.js no inyecta nonces en
 * páginas prerenderizadas en build time — no hay headers ahí). Todas las
 * páginas del sitio deben ser dinámicas; lo contrario bloquea todos los
 * scripts de Next en producción con la CSP estricta.
 */
export const dynamic = 'force-dynamic'

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
      'Agenda una llamada de 15 minutos. Cotizamos tu proyecto con precio fijo y lo construimos con avances funcionales cada viernes.',
    ogDescription:
      'Cotiza tu proyecto y continúa evolucionándolo con un plan mensual. Avances funcionales cada viernes. Precio fijo.',
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
      'Book a 15-minute call. We scope your project at a fixed price and ship working progress every Friday.',
    ogDescription:
      'Get your project scoped and keep evolving it with a monthly plan. Working progress every Friday. Fixed price.',
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  name: 'EXTRO',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description:
    'Agencia de ingeniería de software. Cotiza tu proyecto y, después de la entrega, sigue evolucionándolo con un plan mensual con avances funcionales cada viernes.',
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
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EXTRO',
  url: SITE_URL,
}

/**
 * JSON-LD no es un script ejecutable, así que la CSP con nonce no lo bloquea.
 * Se marca el tipo explícitamente para que ningún navegador lo interprete.
 */
function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
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
    <html lang={lang} className={`${inter.variable} ${spaceGrotesk.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-white text-ink" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-ink focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          {COPY[lang].skip}
        </a>
        <LanguageProvider lang={lang}>{children}</LanguageProvider>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </body>
    </html>
  )
}
