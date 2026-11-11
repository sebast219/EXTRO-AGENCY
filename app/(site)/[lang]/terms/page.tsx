import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteChrome from '@/components/home/SiteChrome'
import LegalTabs from '@/components/legal/LegalTabs'
import { alternatesFor, isLocale } from '@/lib/i18n/config'

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
  return {
    title: 'Legal · EXTRO',
    description:
      lang === 'en'
        ? 'EXTRO personal data policy, terms of use and security. The Spanish version is the binding one.'
        : 'Política de tratamiento de datos personales, términos de uso y seguridad de EXTRO.',
    alternates: alternatesFor('/terms', lang),
    robots: { index: true, follow: true },
  }
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  return (
    <SiteChrome lang={lang}>
      <section style={{ position: 'relative', padding: '150px 24px 0', boxSizing: 'border-box' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: -260,
            width: 1100,
            height: 620,
            marginLeft: -550,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,102,255,0.14), transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, fontFamily: 'var(--font-mono),monospace', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: '#0066ff', boxShadow: '0 0 12px rgba(0,102,255,0.8)' }} />
            {lang === 'en' ? 'Resources' : 'Recursos'}
          </div>
          <h1 className="grad" style={{ margin: '0 0 14px', fontFamily: 'var(--font-space),sans-serif', fontWeight: 500, fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1, letterSpacing: '-0.05em' }}>
            Legal
          </h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
            {lang === 'en'
              ? 'How we handle your data, the rules for using this site and how we protect our clients’ software.'
              : 'Cómo tratamos tus datos, las reglas de uso del sitio y cómo protegemos el software de nuestros clientes.'}
          </p>
          {lang === 'en' && (
            <p style={{ margin: '18px 0 0', maxWidth: 620, padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(0,102,255,0.35)', background: 'rgba(0,102,255,0.1)', fontSize: 14, lineHeight: 1.55, color: '#cfe0ff' }}>
              Courtesy translation of the site interface. The legal documents below are published in Spanish,
              and the Spanish version prevails in case of any discrepancy.
            </p>
          )}
        </div>
      </section>
      <LegalTabs lang={lang} />
    </SiteChrome>
  )
}
