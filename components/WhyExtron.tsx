'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Check } from 'lucide-react'

export default function WhyExtron() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="why" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.whyExtron.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.whyExtron.title}
      </h2>

      <div className="grid sm:grid-cols-2 gap-3 mt-14">
        {t.whyExtron.items.map((item: { title: string; desc: string }, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 60 + 120}ms` } as React.CSSProperties}
            className="card p-4 flex items-start gap-3"
          >
            <Check size={16} strokeWidth={2.5} className="shrink-0 mt-0.5 opacity-40" />
            <div>
              <div className="text-sm font-semibold text-primary font-display">{item.title}</div>
              <div className="text-xs opacity-40 mt-0.5 leading-relaxed">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <p
        data-reveal
        style={{ '--reveal-delay': '600ms' } as React.CSSProperties}
        className="text-sm mt-10 opacity-55 max-w-2xl leading-relaxed"
      >
        {t.whyExtron.footer}
      </p>
    </section>
  )
}
