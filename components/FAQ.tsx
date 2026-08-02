'use client'

import { useState } from 'react'
import { useLang } from './LanguageProvider'
import { Plus } from 'lucide-react'

export default function FAQ() {
  const { t } = useLang()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto scroll-mt-20">
      <div className="section-label">{t.faq.label}</div>
      <h2 className="section-title">{t.faq.title}</h2>

      <div className="mt-10 space-y-3">
        {t.faq.items.map((item, i) => (
          <div
            key={i}
            className={`border rounded-xl overflow-hidden transition-colors ${
              openIndex === i ? 'border-primary' : 'border-border hover:border-primary'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center p-5 text-left"
            >
              <span className="text-[15px] font-medium text-primary pr-4">{item.q}</span>
              <Plus
                size={18}
                className={`text-tertiary shrink-0 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-45' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'max-h-48' : 'max-h-0'
              }`}
            >
              <p className="px-5 pb-5 text-sm text-secondary leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
