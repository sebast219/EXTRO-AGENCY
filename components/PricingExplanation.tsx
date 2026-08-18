'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'

export default function PricingExplanation() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="pricing-explanation" ref={ref} className="py-32 max-w-5xl mx-auto scroll-mt-20 bg-surface/30 -mx-6 px-12 sm:px-16 lg:px-24">
      <div data-reveal className="section-label">
        {t.pricingExplanation.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-xl mb-14">
        {t.pricingExplanation.title}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {t.pricingExplanation.items.map((item, i) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 80 + 120}ms` } as React.CSSProperties}
            className="card p-5"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-45 mb-2">
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="text-sm font-semibold text-primary mb-1.5 font-display">{item.title}</h3>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
