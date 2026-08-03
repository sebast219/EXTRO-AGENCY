'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'

export default function TeamSection() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="team" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.team.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.team.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {t.team.desc}
      </p>

      <div className="grid sm:grid-cols-3 gap-5">
        {t.team.roles.map((role: { name: string; desc: string }, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 120 + 180}ms` } as React.CSSProperties}
            className="card p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-surface mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary opacity-40 tabular-nums font-display">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="text-[15px] font-semibold text-primary font-display">{role.name}</div>
            <div className="text-xs opacity-55 mt-1.5 leading-relaxed">{role.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
