'use client'

import { useEffect, useRef } from 'react'
import { useLang } from './LanguageProvider'
import HeroParticles from './HeroParticles'
import { wrapWords, scrambleWord } from '@/lib/scramble'
import { gsap } from 'gsap'

export default function Hero() {
  const { t } = useLang()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const highlightRef = useRef<HTMLSpanElement>(null)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const titleEl = titleRef.current
    if (!titleEl) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const words = wrapWords(titleEl, t.hero.title)
    let highlightWords: HTMLElement[] = []
    if (highlightRef.current) {
      highlightRef.current.textContent = ''
      highlightWords = wrapWords(highlightRef.current, t.hero.titleHighlight)
    }

    // Esperar a que el preloader termine (~2s) para animar el título
    const delay = window.setTimeout(() => {
      const all = [...words, ...highlightWords]
      all.forEach((w, i) => {
        scrambleWord(w, 0.5, undefined).delay(i * 0.07)
      })
    }, 1900)

    return () => {
      window.clearTimeout(delay)
      gsap.killTweensOf(titleEl.querySelectorAll('span'))
    }
  }, [t.hero.title, t.hero.titleHighlight])

  return (
    <section id="hero" className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
      <HeroParticles />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border rounded-full text-xs text-secondary tracking-wider mb-8 animate-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(206,240,10,0.8)]" />
          {t.hero.tag}
        </div>
        <h1
          ref={titleRef}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.05] mb-6 tracking-tight animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          {t.hero.title}{' '}
          <span ref={highlightRef} className="text-brand-blue">
            {t.hero.titleHighlight}
          </span>
        </h1>
        <p className="text-lg text-secondary leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {t.hero.subtitle}
        </p>
        <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button onClick={() => scrollTo('quote')} className="btn btn-primary px-7 py-3.5">
            {t.hero.cta1}
          </button>
          <button onClick={() => scrollTo('services')} className="btn btn-secondary px-7 py-3.5">
            {t.hero.cta2}
          </button>
        </div>
      </div>
    </section>
  )
}
