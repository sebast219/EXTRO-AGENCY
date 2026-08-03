'use client'

import { useLang } from './LanguageProvider'

export default function ClientsMarquee() {
  const { t } = useLang()

  const outcomes = [...t.marquee.outcomes, ...t.marquee.outcomes]

  return (
    <section className="py-12 border-y border-border">
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-45 text-center">{t.marquee.label}</div>
      </div>
      <div className="marquee">
        <div className="marquee__track">
          {outcomes.map((item, i) => (
            <span key={i} className="marquee__item text-lg font-semibold font-display opacity-45">{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
