'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'

export default function TechAuthority() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="tech" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.techAuthority.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.techAuthority.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {t.techAuthority.desc}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {t.techAuthority.pillars.map((p: { name: string; desc: string }, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 80 + 180}ms` } as React.CSSProperties}
            className="border border-border rounded-lg p-5 hover:border-ink/10 transition-colors"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-40 mb-2">
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="text-sm font-semibold text-primary mb-1.5 font-display">{p.name}</h3>
            <p className="text-xs opacity-40 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
