'use client'

import { useLang } from './LanguageProvider'

export default function Hero() {
  const { t } = useLang()

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
      <div className="inline-block px-4 py-1.5 border border-border rounded-full text-xs text-tertiary tracking-wider mb-6 animate-fade-in-up">
        {t.hero.tag}
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-primary leading-[1.1] mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {t.hero.title}
      </h1>
      <p className="text-lg text-secondary leading-relaxed max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {t.hero.subtitle}
      </p>
      <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={() => scrollTo('quote')}
          className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-85 transition-opacity"
        >
          {t.hero.cta1}
        </button>
        <button
          onClick={() => scrollTo('services')}
          className="px-6 py-3 border border-border rounded-lg text-sm font-medium text-primary hover:border-primary transition-colors"
        >
          {t.hero.cta2}
        </button>
      </div>
    </section>
  )
}
