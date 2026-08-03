'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'

export default function DeliverySystem() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="delivery" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.deliverySystem.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.deliverySystem.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-16">
        {t.deliverySystem.desc}
      </p>

      {/* Weekly cycle */}
      <div className="grid grid-cols-5 gap-2 md:gap-3 mb-20">
        {t.deliverySystem.steps.map((step: { num: string; week: string; title: string; desc: string }, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 80 + 180}ms` } as React.CSSProperties}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-full h-1 rounded-full bg-surface mb-3 overflow-hidden">
              <div
                className="h-full bg-ink opacity-30 group-hover:opacity-40 transition-opacity rounded-full"
                style={{ width: `${(i + 1) * 20}%` }}
              />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-40 mb-2">{step.week}</div>
            <div className="text-[13px] font-semibold text-primary mb-1 font-display">{step.title}</div>
            <div className="text-[10px] opacity-50 leading-relaxed hidden md:block">{step.desc}</div>
          </div>
        ))}
      </div>

      {/* Project phases */}
      <div className="space-y-10">
        {t.deliverySystem.phases.map((phase: { num: string; title: string; desc: string }, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 80 + 500}ms` } as React.CSSProperties}
            className="flex items-start gap-6 group"
          >
            <div className="shrink-0 w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-ink/10 transition-colors">
              <span className="text-[11px] font-bold text-primary tabular-nums font-display opacity-50">{phase.num}</span>
            </div>
            <div className="pt-2.5 flex-1">
              <h3 className="text-base font-semibold text-primary mb-1 font-display">{phase.title}</h3>
              <p className="text-sm leading-relaxed opacity-45 max-w-lg">{phase.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
