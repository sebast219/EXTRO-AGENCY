'use client'

import { useLang } from './LanguageProvider'

export default function Plans() {
  const { t } = useLang()

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="plans" className="py-20 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div className="section-label">{t.plans.label}</div>
      <h2 className="section-title">{t.plans.title}</h2>
      <p className="section-desc">{t.plans.desc}</p>

      <div className="grid md:grid-cols-3 gap-4 mt-10">
        {t.plans.items.map((plan, i) => (
          <div
            key={i}
            className={`p-7 border rounded-xl relative transition-all duration-200 ${
              (plan as any).featured
                ? 'border-primary bg-surface-raised'
                : 'border-border hover:border-primary hover:bg-surface-raised'
            }`}
          >
            {(plan as any).featured && (
              <div className="absolute -top-3 left-5 bg-lime text-primary text-[11px] px-3 py-1 rounded-full font-medium shadow-[0_8px_20px_rgba(206,240,10,0.35)]">
                {t.plans.badge}
              </div>
            )}
            <h3 className="text-lg font-medium text-primary mb-2">{plan.name}</h3>
            <p className="text-sm text-secondary mb-6 min-h-[40px]">{plan.desc}</p>
            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="text-sm text-secondary flex items-center gap-2">
                  <span className="text-primary text-xs">→</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => scrollTo('quote')}
              className={`w-full py-2.5 ${(plan as any).featured ? 'btn btn-primary' : 'btn btn-secondary'}`}
            >
              {t.plans.select}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
