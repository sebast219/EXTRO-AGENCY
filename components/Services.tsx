'use client'

import { useLang } from './LanguageProvider'

export default function Services() {
  const { t } = useLang()

  return (
    <section id="services" className="py-20 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div className="section-label">{t.services.label}</div>
      <h2 className="section-title">{t.services.title}</h2>
      <p className="section-desc">{t.services.desc}</p>

      <div className="grid md:grid-cols-2 gap-4 mt-10">
        {t.services.items.map((item, i) => (
          <div key={i} className="p-7 border border-border rounded-xl card-hover relative overflow-hidden cursor-pointer group">
            <div className="absolute top-5 right-5 text-[11px] px-3 py-1 border border-border rounded-full text-tertiary bg-white">
              {item.tag}
            </div>
            <div className="text-xs text-tertiary font-medium mb-3">{item.num}</div>
            <h3 className="text-xl font-medium text-primary mb-2 group-hover:translate-x-1 transition-transform">
              {item.title}
            </h3>
            <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
