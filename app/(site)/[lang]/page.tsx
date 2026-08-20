import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AmbientGrid from '@/components/AmbientGrid'
import ClientsMarquee from '@/components/ClientsMarquee'
import PainPoints from '@/components/PainPoints'
import Cases from '@/components/Cases'
import Plans from '@/components/Plans'
import PricingExplanation from '@/components/PricingExplanation'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import ScrollProgress from '@/components/ScrollProgress'
import { DeliverySystemLazy, ServicesCarouselLazy } from '@/components/DynamicImports'
import { getTranslations } from '@/lib/i18n'
import { alternatesFor, isLocale } from '@/lib/i18n/config'
import { safeJsonLd } from '@/lib/seo/json-ld'

/**
 * CSP nonce (proxy.ts): el nonce solo se estampa en <script> cuando la página
 * se renderiza por request. Ver el comentario equivalente en layout.tsx.
 */
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return { alternates: alternatesFor('/', lang) }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getTranslations(lang)

  /**
   * B-2: el esquema FAQ estaba duplicado a mano con el mismo texto que ya vivía
   * en las traducciones, y solo existía en español. Al derivarlo de la misma
   * fuente no puede desincronizarse y se localiza solo.
   */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>
      <ScrollProgress />
      <AmbientGrid />
      <Navbar />

      {/* 1 · Hero */}
      <Hero />
      {/* 2 · Prueba social */}
      <ClientsMarquee />
      {/* 3 · Problema → solución */}
      <PainPoints />
      {/* 4 · Cómo trabajamos */}
      <DeliverySystemLazy />
      {/* 5 · Casos */}
      <Cases />
      {/* 6 · Capacidades */}
      <ServicesCarouselLazy />
      {/* 7 · Planes de continuidad */}
      <Plans />
      {/* 8 · Por qué el precio es el que es */}
      <PricingExplanation />
      {/* 9 · Agendar */}
      <Contact />
      {/* 10 · FAQ */}
      <FAQ />

      <Footer />
      <WhatsAppFloat />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
    </main>
  )
}
