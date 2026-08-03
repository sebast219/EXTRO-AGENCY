'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Check, Minus } from 'lucide-react'

export default function Comparison() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="comparison" ref={ref} className="py-32 px-6 max-w-4xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.comparison.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-xl mb-14">
        {t.comparison.title}
      </h2>

      <div data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-6 font-medium opacity-50 text-xs uppercase tracking-wider" />
              {t.comparison.columns.map((col, i) => (
                <th
                  key={i}
                  className={`py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider ${
                    i === 2 ? 'text-primary bg-surface/40 rounded-t-lg' : 'opacity-50'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.comparison.rows.map((row, i) => (
              <tr key={i} className="border-b border-border">
                <td className="py-3.5 pr-6 opacity-50">{row.label}</td>
                {row.values.map((val, j) => (
                  <td
                    key={j}
                    className={`py-3.5 px-4 text-center ${
                      j === 2 ? 'bg-surface/40' : ''
                    }`}
                  >
                    {val ? (
                      <Check size={15} strokeWidth={2.5} className="inline-block opacity-45" />
                    ) : (
                      <Minus size={15} strokeWidth={1.5} className="inline-block opacity-10" />
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
        className="text-sm mt-8 opacity-55 text-center font-medium"
      >
        {t.comparison.footer}
      </p>
    </section>
  )
}
