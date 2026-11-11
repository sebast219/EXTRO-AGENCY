'use client'

import { useState } from 'react'
import { getFaqItems } from './faq-items'
import { HOME_COPY } from '@/lib/i18n/home-copy'
import type { Locale } from '@/lib/i18n/config'

export default function HomeFaq({ lang }: { lang: Locale }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const c = HOME_COPY[lang].faq
  const items = getFaqItems(lang)

  return (
    <section
      id="faq"
      style={{ position: 'relative', zIndex: 1, padding: 'clamp(96px, 11vw, 150px) 24px', boxSizing: 'border-box' }}
    >
      <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px 64px' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div
            className="rv"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
              fontFamily: 'var(--font-mono),monospace',
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <span
              aria-hidden="true"
              style={{ width: 8, height: 8, borderRadius: 999, background: '#0066ff', boxShadow: '0 0 12px rgba(0,102,255,0.8)' }}
            />
            {c.eyebrow}
          </div>
          <h2
            className="grad rv"
            style={{
              margin: '0 0 16px',
              fontFamily: 'var(--font-space),sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(36px, 4.8vw, 56px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            {c.title}
          </h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
            {c.contact}{' '}
            <a href="mailto:consultas@extro.com.co" style={{ color: '#fff' }}>
              consultas@extro.com.co
            </a>
          </p>
        </div>
        <div style={{ flex: '999 1 560px', minWidth: 0, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          {items.map((item, i) => {
            const open = openIdx === i
            return (
              <div key={item.q} style={{ borderBottom: '1px solid #27272a' }}>
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="faq-btn"
                    id={`faq-button-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIdx(open ? null : i)}
                    style={{
                      width: '100%',
                      minHeight: 44,
                      textAlign: 'left',
                      padding: '18px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 16,
                      borderRadius: 6,
                      background: 'none',
                      border: 0,
                      color: '#fff',
                      font: 'inherit',
                    }}
                  >
                    <span
                      className="faq-q"
                      style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5, color: '#fafafa', textUnderlineOffset: 4 }}
                    >
                      {item.q}
                    </span>
                    <span
                      style={{ flexShrink: 0, marginTop: 4, color: 'rgba(255,255,255,0.5)', display: 'inline-flex' }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={open ? { transform: 'rotate(180deg)' } : undefined}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                </h3>
                {open && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className="faq-a"
                    style={{ padding: '0 36px 22px 0', fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
