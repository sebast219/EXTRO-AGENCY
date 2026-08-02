'use client'

import { useState } from 'react'
import { useLang } from './LanguageProvider'
import { Plus } from 'lucide-react'

export default function FAQ() {
  const { t } = useLang()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const total = t.faq.items.length

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto scroll-mt-20">
      <div className="section-label">{t.faq.label}</div>
      <h2 className="section-title">{t.faq.title}</h2>

      <div className="mt-10">
        {t.faq.items.map((item, i) => {
          const open = openIndex === i
          return (
            <div
              key={i}
              className={`border-b transition-colors ${open ? 'border-primary' : 'border-border'}`}
            >
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                aria-expanded={open}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={`text-xs tabular-nums tracking-wider transition-colors ${
                      open ? 'text-brand-blue' : 'text-tertiary'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] font-medium text-primary group-hover:text-brand-blue transition-colors">
                    {item.q}
                  </span>
                </span>
                <Plus
                  size={18}
                  className={`text-tertiary shrink-0 transition-transform duration-300 ${
                    open ? 'rotate-45 text-brand-blue' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 pl-10 pr-6 text-sm text-secondary leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
