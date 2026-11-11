import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HomeNav from '@/components/home/HomeNav'
import HomeHero from '@/components/home/HomeHero'
import HomeTech from '@/components/home/HomeTech'
import HomeSolutions from '@/components/home/HomeSolutions'
import HomeCases from '@/components/home/HomeCases'
import HomeProcess from '@/components/home/HomeProcess'
import HomeCtaReserva from '@/components/home/HomeCtaReserva'
import HomeBooking from '@/components/home/HomeBooking'
import HomeFaq from '@/components/home/HomeFaq'
import HomeClients from '@/components/home/HomeClients'
import HomeFooter from '@/components/home/HomeFooter'
import HomeFx from '@/components/home/HomeFx'
import { getFaqItems } from '@/components/home/faq-items'
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

  // El esquema FAQ sale de la misma fuente que la UI (getFaqItems): no puede
  // desincronizarse ni mezclar idiomas con el contenido visible.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: getFaqItems(lang).map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        style={{
          position: 'relative',
          width: '100%',
          background: '#050505',
          color: '#fff',
          overflow: 'hidden',
          fontFamily: 'var(--font-inter),system-ui,sans-serif',
        }}
      >
        <div className="xp" aria-hidden="true" />
        <HomeNav />
        <HomeHero lang={lang} />
        <HomeTech lang={lang} />
        <HomeSolutions lang={lang} />
        <HomeCases lang={lang} />
        <HomeProcess lang={lang} />
        <HomeCtaReserva lang={lang}>
          <HomeBooking />
        </HomeCtaReserva>
        <HomeFaq lang={lang} />
        <HomeClients lang={lang} />
      </main>
      <HomeFooter lang={lang} />
      <HomeFx key={lang} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
    </>
  )
}
