'use client'

import { useSyncExternalStore } from 'react'
import LegalDatos from './LegalDatos'
import LegalTerminos from './LegalTerminos'
import LegalSeguridad from './LegalSeguridad'
import type { Locale } from '@/lib/i18n/config'

const TABS = [
  { id: 'datos', label: { es: 'Datos personales', en: 'Personal data' }, icon: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zM12 8v4M12 16h.01' },
  { id: 'terminos', label: { es: 'Términos de uso', en: 'Terms of use' }, icon: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8' },
  { id: 'seguridad', label: { es: 'Seguridad', en: 'Security' }, icon: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4' },
] as const

type TabId = (typeof TABS)[number]['id']

const COPY: Record<Locale, {
  navAria: string
  doubts: string
  sla: string
}> = {
  es: {
    navAria: 'Documentos legales',
    doubts: '¿Dudas sobre tus datos?',
    sla: 'Respondemos consultas en máximo 10 días hábiles.',
  },
  en: {
    navAria: 'Legal documents',
    doubts: 'Questions about your data?',
    sla: 'We reply to requests within 10 business days.',
  },
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export default function LegalTabs({ lang }: { lang: Locale }) {
  const c = COPY[lang]
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '')
  const tab: TabId = TABS.find((t) => '#' + t.id === hash)?.id ?? 'datos'

  const pick = (id: TabId) => {
    window.history.replaceState(null, '', '#' + id)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  return (
    <section style={{ position: 'relative', padding: '56px 24px 120px', boxSizing: 'border-box' }}>
      <div className="lg-wrap" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <aside className="lg-side">
          <nav aria-label={c.navAria} className="lg-tabs" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map((t) => {
              const on = t.id === tab
              return (
                <button
                  key={t.id}
                  type="button"
                  className="lg-tab"
                  aria-current={on ? 'page' : undefined}
                  onClick={() => pick(t.id)}
                  style={{ background: on ? 'rgba(255,255,255,0.06)' : undefined, color: on ? '#fafafa' : undefined }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={t.icon} />
                  </svg>
                  {t.label[lang]}
                </button>
              )
            })}
          </nav>
          <div style={{ marginTop: 28, padding: 16, borderRadius: 12, background: '#0c0c0d', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: '#71717a', marginBottom: 8 }}>{c.doubts}</div>
            <a href="mailto:consultas@extro.com.co" style={{ fontSize: 14, color: '#fafafa', textUnderlineOffset: 3 }}>
              consultas@extro.com.co
            </a>
            <div style={{ marginTop: 4, fontSize: 13, color: '#a1a1aa' }}>{c.sla}</div>
          </div>
        </aside>
        <div style={{ minWidth: 0 }}>
          {tab === 'datos' && <LegalDatos />}
          {tab === 'terminos' && <LegalTerminos />}
          {tab === 'seguridad' && <LegalSeguridad />}
        </div>
      </div>
    </section>
  )
}
