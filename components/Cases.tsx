'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { ArrowUpRight, Clock, Users } from 'lucide-react'

export default function Cases() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="deployments" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.cases.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.cases.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {t.cases.desc}
      </p>

      <div className="grid lg:grid-cols-3 gap-5">
        {t.cases.items.map((item, i) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 100 + 180}ms` } as React.CSSProperties}
            className="card overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${item.status === 'dev' ? 'bg-accent' : 'bg-ink opacity-50'}`} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50">
                  {(t.cases.status as Record<string, string>)[item.status]}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-primary mb-3 font-display">{item.title}</h3>

              <div className="flex-1 space-y-3 mb-5">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-40 mb-0.5">Problema</div>
                  <p className="text-xs opacity-45 leading-relaxed">{item.problem}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-40 mb-0.5">Solución</div>
                  <p className="text-xs opacity-45 leading-relaxed">{item.solution}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-55">{item.metricLabel}</span>
                  <span className="text-sm font-bold text-primary tabular-nums font-display">{item.result}</span>
                </div>
                <div className="flex items-center justify-between text-xs opacity-55">
                  <span className="flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {item.users}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {item.tech.map((t: string) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border opacity-55">{t}</span>
                ))}
              </div>
            </div>

            <div className="px-6 pb-5">
              <span className="inline-flex items-center gap-1 text-xs font-medium opacity-45 hover:opacity-50 transition-opacity cursor-default">
                Ver proyecto <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {'disclaimer' in t.cases && (
        <p className="text-[11px] opacity-45 text-center mt-12 max-w-xl mx-auto leading-relaxed">
          {(t.cases as { disclaimer?: string }).disclaimer}
        </p>
      )}
    </section>
  )
}
