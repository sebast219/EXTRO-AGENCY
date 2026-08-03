'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Check } from 'lucide-react'

export default function WeeklyBuild() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="weekly" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.weeklyBuild.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.weeklyBuild.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {t.weeklyBuild.desc}
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {t.weeklyBuild.items.map((item: { week: string; deliverables: string[] }, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 150 + 180}ms` } as React.CSSProperties}
            className="card p-6"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-45 mb-4">
              {item.week}
            </div>
            <ul className="space-y-3">
              {item.deliverables.map((d: string, j: number) => (
                <li key={j} className="flex items-start gap-2.5 text-sm opacity-55">
                  <Check size={13} strokeWidth={2} className="shrink-0 mt-0.5 opacity-45" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p
        data-reveal
        style={{ '--reveal-delay': '500ms' } as React.CSSProperties}
        className="text-sm mt-10 opacity-40 text-center max-w-lg mx-auto leading-relaxed"
      >
        {t.weeklyBuild.cta}
      </p>
    </section>
  )
}
