'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useState } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { HOME_COPY } from '@/lib/i18n/home-copy'
import { LOCALES, type Locale } from '@/lib/i18n/config'

/**
 * Nav de la home y de las páginas internas.
 *
 * En móvil (≤860px) los enlaces y el botón de WhatsApp viven en un panel
 * desplegable: antes llevaban la clase `nav-links`, que los ocultaba, y el
 * visitante se quedaba sin forma de navegar ni de escribir.
 */
export default function HomeNav({ base = '' }: { base?: string }) {
  const { lang, pendingLang, setLang } = useLang()
  const active = pendingLang ?? lang
  const c = HOME_COPY[lang].nav
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    { href: `${base}#soluciones`, label: c.solutions },
    { href: `${base}#casos`, label: c.cases },
    { href: `${base}#proceso`, label: c.process },
    { href: `${base}#faq`, label: c.faq },
  ]

  const switchLang = (target: Locale) => {
    setOpen(false)
    setLang(target)
  }

  return (
    <header className="nav" style={{ position: 'fixed', top: '16px', left: '50%', right: 'auto', zIndex: '50', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(14,14,14,0.78)', backdropFilter: 'blur(20px) saturate(1.4)', transform: 'translateX(-50%)', width: 'min(1040px, calc(100% - 32px))', borderRadius: '999px', boxShadow: '0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 'none', margin: '0 auto', padding: '0px 8px 0px 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', boxSizing: 'border-box' }}>
        <a href={`${base}#inicio`} aria-label={c.homeAria} style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/brand/extro-logo.png" alt="EXTRO" style={{ display: 'block', width: '103px', height: '30px' }} />
        </a>
        <nav aria-label={c.aria} className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          {links.map((link) => (
            <a key={link.href} className="nav-a" href={link.href} style={{ textDecoration: 'none' }}>
              {link.label}
            </a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="nav-links" role="group" aria-label={c.language} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', padding: '2px', border: '1px solid #27272a', borderRadius: '999px' }}>
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLang(code)}
                aria-pressed={active === code}
                style={{
                  minWidth: '32px',
                  minHeight: '30px',
                  padding: '0 8px',
                  borderRadius: '999px',
                  border: 0,
                  background: active === code ? '#fafafa' : 'transparent',
                  color: active === code ? '#18181b' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--font-mono),monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {code}
              </button>
            ))}
          </div>
          <a href="https://wa.me/573005865312" className="btn-g nav-links mag" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '40px', padding: '0 16px', borderRadius: '999px', background: 'rgba(9,9,11,0.6)', border: '1px solid #27272a', color: '#fff', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
            {c.whatsapp}
          </a>
          <a href={`${base}#contacto`} className="btn-w mag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '40px', padding: '0 16px', borderRadius: '999px', background: '#fafafa', color: '#18181b', fontSize: '14px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <span className="nav-cta-full">{c.cta}</span>
            <span className="nav-cta-short">{c.ctaShort}</span>
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? c.close : c.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      {open ? (
        <div id={panelId} className="nav-mobile">
          <nav aria-label={c.aria} style={{ display: 'flex', flexDirection: 'column' }}>
            {links.map((link) => (
              <a key={link.href} href={link.href} className="nav-a" onClick={() => setOpen(false)} style={{ padding: '12px 8px', fontSize: '15px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)' }}>
                {link.label}
              </a>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '10px 8px 4px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <a href="https://wa.me/573005865312" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '38px', padding: '0 14px', borderRadius: '999px', border: '1px solid #27272a', color: '#fff', fontSize: '14px', textDecoration: 'none' }}>
              {c.whatsapp}
            </a>
            <div role="group" aria-label={c.language} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', padding: '2px', border: '1px solid #27272a', borderRadius: '999px' }}>
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchLang(code)}
                  aria-pressed={active === code}
                  style={{
                    minWidth: '36px',
                    minHeight: '32px',
                    padding: '0 8px',
                    borderRadius: '999px',
                    border: 0,
                    background: active === code ? '#fafafa' : 'transparent',
                    color: active === code ? '#18181b' : 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-mono),monospace',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
