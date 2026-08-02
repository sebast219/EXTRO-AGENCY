'use client'

import { useLang } from './LanguageProvider'

export default function WhyExtron() {
  const { t } = useLang()

  return (
    <section id="why" className="py-20 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div className="section-label">{t.why.label}</div>
      <h2 className="section-title">{t.why.title}</h2>

      <div className="grid md:grid-cols-2 gap-4 mt-10">
        {t.why.items.map((item, i) => (
          <div key={i} className="p-7 border border-border rounded-xl card-hover cursor-default">
            <div className="text-xs text-tertiary font-medium mb-3">{item.num}</div>
            <h3 className="text-lg font-medium text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
