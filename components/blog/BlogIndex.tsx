'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type BlogCardPost = {
  slug: string
  href: string
  title: string
  tag: string
  date: string
  excerpt: string
  readTime: string
}

const ALL = 'Todos'

// Portadas: degradados de la identidad (azul/zinc) + un icono Lucide por categoría.
const COVERS = [
  'linear-gradient(135deg,#0a1a3f 0%,#0b0b10 70%)',
  'linear-gradient(135deg,#0b2a6b 0%,#07070a 75%)',
  'linear-gradient(160deg,#10102a 0%,#08121f 80%)',
  'linear-gradient(135deg,#142048 0%,#0a0a0c 70%)',
  'linear-gradient(150deg,#0c1a36 0%,#0f0a1f 80%)',
]
const ICONS = [
  'm16 18 6-6-6-6M8 6l-6 6 6 6',
  'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  'm12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5',
  'M12 20V10M18 20V4M6 20v-4',
  'M12 8V4H8M4 8h16v12H4zM2 14h2M20 14h2M15 13v2M9 13v2',
]

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export default function BlogIndex({ posts }: { posts: BlogCardPost[] }) {
  const [cat, setCat] = useState(ALL)
  const [query, setQuery] = useState('')

  const cats = useMemo(() => [ALL, ...Array.from(new Set(posts.map((p) => p.tag)))], [posts])
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(
      (p) =>
        (cat === ALL || p.tag === cat) &&
        (!q || `${p.title} ${p.excerpt} ${p.tag}`.toLowerCase().includes(q)),
    )
  }, [posts, cat, query])

  return (
    <>
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
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,102,255,0.16), transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, fontFamily: 'var(--font-mono),monospace', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: '#0066ff', boxShadow: '0 0 12px rgba(0,102,255,0.8)' }} />
            Recursos
          </div>
          <h1 className="grad" style={{ margin: '0 0 14px', fontFamily: 'var(--font-space),sans-serif', fontWeight: 500, fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1, letterSpacing: '-0.05em' }}>
            Blog
          </h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
            Ingeniería, producto y negocio: lo que aprendemos construyendo software a la medida para emprendimientos y empresas.
          </p>

          <div className="bl-bar" style={{ marginTop: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px 24px' }}>
            <div role="tablist" aria-label="Categorías" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cats.map((c) => {
                const on = c === cat
                return (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    className="bl-pill"
                    aria-selected={on}
                    onClick={() => setCat(c)}
                    style={{ minHeight: 38, padding: '0 15px', borderRadius: 999, border: 0, background: on ? '#27272a' : 'transparent', color: on ? '#fff' : '#a1a1aa', fontSize: 14, fontWeight: 500 }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
            <label className="bl-search" style={{ display: 'flex', alignItems: 'center', gap: 8, width: 220, height: 38, padding: '0 12px', borderRadius: 999, border: '1px solid #27272a', background: '#09090b', boxSizing: 'border-box', transition: 'border-color .2s ease' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                aria-label="Buscar artículos"
                placeholder="Buscar…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ flex: 1, minWidth: 0, height: '100%', border: 0, outline: 'none', background: 'transparent', color: '#fafafa', font: 'inherit', fontSize: 14 }}
              />
            </label>
          </div>
        </div>
      </section>

      <section aria-label="Artículos" style={{ position: 'relative', padding: '44px 24px 120px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="bl-grid">
            {shown.map((p) => {
              const h = hash(p.tag)
              return (
                <Link
                  key={p.slug}
                  href={p.href}
                  className="bl-card"
                  style={{ display: 'flex', flexDirection: 'column', padding: 24, borderRadius: 12, background: '#0c0c0d', color: 'inherit', textDecoration: 'none', boxSizing: 'border-box' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                    <time style={{ color: '#fafafa' }}>{p.date}</time>
                    <span style={{ color: '#71717a' }}>{p.tag}</span>
                  </div>
                  <h2 className="bl-title" style={{ margin: '14px 0 0', fontFamily: 'var(--font-space),sans-serif', fontSize: 27, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#ededed', textWrap: 'balance', minHeight: 'calc(1.15em * 3)' }}>
                    {p.title}
                  </h2>
                  <div style={{ position: 'relative', margin: '24px 0 22px', aspectRatio: '16 / 10', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0b' }}>
                    <div className="bl-cover" style={{ position: 'absolute', inset: 0, background: COVERS[h % COVERS.length] }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '14px 14px', WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, #000 10%, transparent 75%)', maskImage: 'radial-gradient(ellipse at 50% 55%, #000 10%, transparent 75%)' }} />
                      <div className="bl-tile" style={{ position: 'absolute', left: '50%', top: '50%', width: 96, height: 96, margin: '-48px 0 0 -48px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.18)', background: 'linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={ICONS[h % ICONS.length]} />
                        </svg>
                      </div>
                      <span style={{ position: 'absolute', left: 14, top: 12, fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>+ EXTRO · {p.tag}</span>
                      <span style={{ position: 'absolute', right: 14, bottom: 12, fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{p.readTime}</span>
                    </div>
                  </div>
                  <p style={{ margin: 'auto 0 18px', fontSize: 14.5, lineHeight: 1.55, color: '#a1a1aa' }}>{p.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#fafafa' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 999, background: 'linear-gradient(135deg,#1e3a8a,#0066ff)', border: '2px solid #0c0c0d', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>EX</span>
                    EXTRO
                  </div>
                </Link>
              )
            })}
          </div>
          {shown.length === 0 && (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#a1a1aa', fontSize: 15 }}>
              No encontramos artículos con esa búsqueda.{' '}
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCat(ALL)
                }}
                style={{ background: 'none', border: 0, padding: 0, color: '#7fb2ff', font: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                Ver todos
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
