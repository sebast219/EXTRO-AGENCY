'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Check } from 'lucide-react'

type PlanItem = {
  name: string
  price: string
  desc: string
  features: string[]
  featured?: boolean
}

export default function Plans() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="plans" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.plans.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.plans.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {t.plans.desc}
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-14">
        {(t.plans.items as PlanItem[]).map((plan, i) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 100 + 180}ms` } as React.CSSProperties}
            className={`relative p-8 rounded-xl transition-all duration-300 ${
              plan.featured
                ? 'card-featured scale-[1.02] md:scale-[1.04] z-10'
                : 'card'
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] px-4 py-1 rounded-full font-semibold tracking-wider whitespace-nowrap">
                {t.plans.badge}
              </div>
            )}

            <h3 className="text-lg font-semibold text-primary mb-1 font-display">{plan.name}</h3>
            <div className="mb-1">
              <span className="text-3xl font-bold text-primary tabular-nums tracking-tight font-display">{plan.price}</span>
            </div>
            <p className="text-sm mb-6 opacity-50 leading-relaxed">{plan.desc}</p>

            <button onClick={() => scrollTo('contact')} className={`w-full mb-8 ${plan.featured ? 'btn btn-primary' : 'btn btn-secondary'} py-3`}>
              {t.plans.select}
            </button>

            <ul className="space-y-3">
              {plan.features.map((f, j) => (
                <li key={j} className="text-sm flex items-start gap-2.5 opacity-55">
                  <Check size={13} strokeWidth={2} className="shrink-0 mt-0.5 opacity-45" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p
        data-reveal
        style={{ '--reveal-delay': '500ms' } as React.CSSProperties}
        className="text-center text-xs opacity-50 max-w-md mx-auto leading-relaxed"
      >
        {t.plans.guarantee}
      </p>
    </section>
  )
}
