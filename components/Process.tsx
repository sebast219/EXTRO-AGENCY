'use client'

import { useLang } from './LanguageProvider'

export default function Process() {
  const { t } = useLang()

  return (
    <section id="process" className="py-20 px-6 max-w-3xl mx-auto scroll-mt-20">
      <div className="section-label">{t.process.label}</div>
      <h2 className="section-title">{t.process.title}</h2>

      <div className="mt-10 space-y-0">
        {t.process.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-6 pl-6 py-7 border-l-2 border-border hover:border-primary hover:bg-surface-raised transition-all relative group"
          >
            <div className="absolute -left-[13px] top-7 w-6 h-6 rounded-full bg-white border-2 border-border group-hover:border-primary flex items-center justify-center text-[11px] font-medium text-tertiary group-hover:text-primary transition-colors">
              {item.num}
            </div>
            <div>
              <h3 className="text-lg font-medium text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-secondary">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
