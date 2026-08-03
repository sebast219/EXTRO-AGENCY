'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Layers, Code, PenTool, MessageCircle, FileText, Rocket } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  layers: Layers,
  code: Code,
  'pen-tool': PenTool,
  'message-circle': MessageCircle,
  'file-text': FileText,
  rocket: Rocket,
}

export default function ToolsStack() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  return (
    <section id="tools" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.tools.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.tools.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {t.tools.desc}
      </p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {t.tools.tools.map((tool, i) => {
          const Icon = iconMap[tool.icon] || Layers
          return (
            <div
              key={i}
              data-reveal
              style={{ '--reveal-delay': `${i * 80 + 180}ms` } as React.CSSProperties}
              className="card p-4 text-center"
            >
              <Icon size={22} strokeWidth={1.5} className="mx-auto mb-2.5 opacity-45" />
              <div className="text-[13px] font-semibold text-primary mb-0.5 font-display">{tool.name}</div>
              <div className="text-[10px] opacity-55">{tool.role}</div>
            </div>
          )
        })}
      </div>

      <p
        data-reveal
        style={{ '--reveal-delay': '600ms' } as React.CSSProperties}
        className="text-sm mt-10 opacity-40 text-center max-w-lg mx-auto leading-relaxed"
      >
        {t.tools.cta}
      </p>
    </section>
  )
}
