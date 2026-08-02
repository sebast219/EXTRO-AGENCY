'use client'

import { useLang } from './LanguageProvider'

export default function Cases() {
  const { t } = useLang()

  const statusClass = (status: string) => {
    switch (status) {
      case 'dev': return 'bg-amber-50 text-amber-600'
      case 'done': return 'bg-green-50 text-green-600'
      default: return 'bg-gray-50 text-gray-500'
    }
  }

  return (
    <section id="cases" className="py-20 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div className="section-label">{t.cases.label}</div>
      <h2 className="section-title">{t.cases.title}</h2>
      <p className="section-desc">{t.cases.desc}</p>

      <div className="grid md:grid-cols-2 gap-4 mt-10">
        {t.cases.items.map((item, i) => (
          <div key={i} className="p-6 border border-border rounded-xl card-hover cursor-pointer">
            <span className={`inline-block text-[11px] px-3 py-1 rounded-full mb-3 font-medium ${statusClass(item.status)}`}>
              {(t.cases.status as Record<string, string>)[item.status]}
            </span>
            <h3 className="text-lg font-medium text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
