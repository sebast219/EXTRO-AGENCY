'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { X } from 'lucide-react'

export default function ScopeSection() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="scope" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.scope.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.scope.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {t.scope.desc}
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {t.scope.items.map((item: string, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 60 + 180}ms` } as React.CSSProperties}
            className="flex items-center gap-3 py-2.5 px-4 rounded-lg border border-border opacity-50"
          >
            <X size={13} strokeWidth={2} className="shrink-0 opacity-40" />
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>

      <p
        data-reveal
        style={{ '--reveal-delay': '500ms' } as React.CSSProperties}
        className="text-sm mt-10 opacity-55 max-w-2xl text-center mx-auto leading-relaxed"
      >
        {t.scope.footer}
      </p>
    </section>
  )
}
