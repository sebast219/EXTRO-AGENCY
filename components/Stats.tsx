'use client'

import { useLang } from './LanguageProvider'

export default function Stats() {
  const { t } = useLang()
  const stats = [t.stats.s1, t.stats.s2, t.stats.s3, t.stats.s4]

  return (
    <section className="px-6 pb-20 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-6 border border-border rounded-xl text-center card-hover">
            <div className="text-3xl md:text-4xl font-medium text-primary tabular-nums">{s.num}</div>
            <div className="text-sm text-tertiary mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
