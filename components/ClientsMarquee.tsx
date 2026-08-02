'use client'

import { useLang } from './LanguageProvider'

export default function ClientsMarquee() {
  const { t } = useLang()

  const Row = ({ items, reverse }: { items: string[]; reverse?: boolean }) => (
    <div className={`marquee ${reverse ? 'marquee--reverse' : ''}`}>
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-2rem" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <span key={i} className="marquee__item">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section id="clients" className="py-16 border-y border-border overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <div className="section-label">{t.marquee.label}</div>
      </div>
      <div className="space-y-6">
        <Row items={t.marquee.industries} />
        <Row items={t.marquee.tech} reverse />
      </div>
    </section>
  )
}
