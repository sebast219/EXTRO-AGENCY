'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useLang } from './LanguageProvider'
import { gsap } from 'gsap'
import { scrambleWord } from '@/lib/scramble'
import { ArrowDown, ArrowRight } from 'lucide-react'

export default function Hero() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  const titleWords = useMemo(() => t.hero.title.split(' '), [t.hero.title])
  const highlightWords = useMemo(
    () => t.hero.titleHighlight ? t.hero.titleHighlight.split(' ') : [],
    [t.hero.titleHighlight]
  )

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const spans = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>('[data-scramble]') ?? []
    )
    if (!spans.length) return

    const tweens: gsap.core.Tween[] = []
    const delay = window.setTimeout(() => {
      spans.forEach((el, i) => {
        tweens.push(scrambleWord(el, 0.4).delay(i * 0.05))
      })
    }, 800)

    return () => {
      window.clearTimeout(delay)
      tweens.forEach((tw) => tw.kill())
    }
  }, [titleWords, highlightWords])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center pt-28 pb-20 px-6 overflow-hidden"
    >
      <div className="hero-columns" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="hero-columns__col" />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        <h1
          className="font-display font-semibold text-primary leading-[0.96] tracking-[-0.04em] mb-6 text-[clamp(2.6rem,6.5vw,4.75rem)] animate-fade-in-up"
          style={{ animationDelay: '0.05s' }}
        >
          {titleWords.map((word, i) => (
            <span key={`w-${i}`} data-scramble data-text={word} className="inline-block mr-[0.18em]">
              {word}
            </span>
          ))}
          {highlightWords.length > 0 && (
            <span className="block mt-2 opacity-45 text-[clamp(1.6rem,3.5vw,2.5rem)]">
              {highlightWords.map((word, i) => (
                <span
                  key={`h-${i}`}
                  data-scramble
                  data-text={word}
                  className="inline-block mr-[0.15em] last:mr-0"
                >
                  {word}
                </span>
              ))}
            </span>
          )}
        </h1>

        <p
          className="text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.2s', opacity: 0.60 }}
        >
          {t.hero.subtitle}
        </p>

        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <button onClick={() => scrollTo('plans')} className="btn btn-primary px-8 py-4">
            <span>{t.hero.cta1}</span>
            <span className="btn-arrow">
              <ArrowRight size={17} strokeWidth={2} />
            </span>
          </button>
          <button onClick={() => scrollTo('deployments')} className="btn btn-secondary px-8 py-4">
            <span>{t.hero.cta2}</span>
            <span className="btn-arrow">
              <ArrowRight size={17} strokeWidth={2} />
            </span>
          </button>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {t.hero.badges.map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-border text-primary opacity-40"
            >
              <span className="w-1 h-1 rounded-full bg-ink opacity-45" />
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 scroll-hint" aria-hidden="true">
        <ArrowDown size={16} strokeWidth={1.5} style={{ opacity: 0.30 }} />
      </div>
    </section>
  )
}
