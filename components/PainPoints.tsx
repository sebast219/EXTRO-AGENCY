'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Check } from 'lucide-react'

export default function PainPoints() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()
  const p = t.painPoints

  return (
    <section id="pain-points" ref={ref} className="py-32 px-6 max-w-4xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {p.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {p.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {p.desc}
      </p>

      <p className="sm:hidden text-xs text-[var(--text-tertiary)] mb-2" aria-hidden="true">
        {p.scrollHint}
      </p>
      <div
        data-reveal
        style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
        className="overflow-x-auto scroll-fade-x"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-6 font-medium opacity-50 text-xs uppercase tracking-wider" />
              {p.columns.map((col: string, i: number) => (
                <th
                  key={i}
                  className={`py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider whitespace-nowrap ${
                    i === 3 ? 'text-accent' : 'opacity-50'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.rows.map((row: { label: string; values: string[] }, i: number) => (
              <tr key={i} className="border-b border-border">
                <td className="py-3.5 pr-6 text-[13px] text-[var(--text-secondary)]">{row.label}</td>
                {row.values.map((val: string, j: number) => (
                  <td
                    key={j}
                    className={`py-3.5 px-4 text-center text-[13px] whitespace-nowrap ${
                      j === 3
                        ? 'font-semibold text-accent'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {j === 3 && row.values[j] !== row.values[0] ? (
                      <span className="inline-flex items-center gap-1">
                        <Check size={12} strokeWidth={3} className="text-accent" />
                        {val}
                      </span>
                    ) : (
                      val
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p
        data-reveal
        style={{ '--reveal-delay': '300ms' } as React.CSSProperties}
        className="text-sm mt-8 opacity-60 text-center font-medium"
      >
        {p.footer}
      </p>
    </section>
  )
}
