'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'

export default function EngineeringPrinciples() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="principles" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.principles.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.principles.title}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-14">
        {t.principles.items.map((item: string, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 70 + 120}ms` } as React.CSSProperties}
            className="flex items-center gap-3 py-3.5 px-5 rounded-lg border border-border opacity-60 hover:opacity-80 hover:border-ink/10 transition-all"
          >
            <span className="text-[10px] font-bold tabular-nums opacity-40 font-display">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>

      <p
        data-reveal
        style={{ '--reveal-delay': '500ms' } as React.CSSProperties}
        className="text-sm mt-12 opacity-50 max-w-xl text-center mx-auto leading-relaxed"
      >
        {t.principles.footer}
      </p>
    </section>
  )
}
