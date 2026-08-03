'use client'

import { useState } from 'react'
import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Minus, Plus } from 'lucide-react'

export default function FAQ() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i)

  return (
    <section id="faq" ref={ref} className="py-32 px-6 max-w-2xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.faq.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title">
        {t.faq.title}
      </h2>

      <div className="mt-14 space-y-1">
        {t.faq.items.map((item, i) => {
          const open = openIdx === i
          return (
            <div key={i} data-reveal style={{ '--reveal-delay': `${i * 60 + 120}ms` } as React.CSSProperties}>
              <button
                onClick={() => toggle(i)}
                className="w-full text-left py-4 flex items-start justify-between gap-4 group"
              >
                <span className="text-sm font-medium text-primary group-hover:opacity-70 transition-opacity">
                  {item.q}
                </span>
                <span className="text-primary shrink-0 mt-0.5 opacity-50">
                  {open ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              {open && (
                <div className="pb-5 text-sm opacity-55 leading-relaxed">
                  {item.a}
                </div>
              )}
              <div className="h-px bg-border" />
            </div>
          )
        })}
      </div>
    </section>
  )
}
