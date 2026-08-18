'use client'

import { useEffect, useRef } from 'react'
import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function DeliverySystem() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()
  const pipelineRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Registrado en el efecto, no en el módulo: el componente se renderiza en
    // servidor y ScrollTrigger solo tiene sentido en el cliente.
    gsap.registerPlugin(ScrollTrigger)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pipeline = pipelineRef.current
    const dot = dotRef.current
    if (!pipeline || !dot) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          dot,
          { left: '0%' },
          {
            left: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: pipeline,
              start: 'top 75%',
              end: 'top 25%',
              scrub: 1,
            },
          }
        )
      })

      mm.add('(max-width: 767.98px)', () => {
        gsap.fromTo(
          dot,
          { top: '0%' },
          {
            top: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: pipeline,
              start: 'top 75%',
              end: 'bottom 25%',
              scrub: 1,
            },
          }
        )
      })

      /* Pulse each step dot as the main dot passes */
      const steps = pipeline.querySelectorAll<HTMLElement>('.pipeline-step-dot')
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: pipeline,
          start: `${25 + i * 15}% 60%`,
          end: `${40 + i * 15}% 40%`,
          onEnter: () => step.classList.add('pipeline-step-active'),
          onLeaveBack: () => step.classList.remove('pipeline-step-active'),
        })
      })
    }, pipeline)

    return () => ctx.revert()
  }, [])

  return (
    <section id="delivery" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20 text-center">
      <div data-reveal className="section-label justify-center">
        {t.deliverySystem.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl mx-auto">
        {t.deliverySystem.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-16 mx-auto">
        {t.deliverySystem.desc}
      </p>

      {/* Pipeline with animated dot */}
      <div
        ref={pipelineRef}
        data-reveal
        style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
        className="relative mb-20 flex flex-row md:flex-col gap-5 md:gap-0 md:items-center max-w-md mx-auto md:max-w-none"
      >
        {/* Pipeline track */}
        <div className="relative w-[5px] md:w-[85%] md:h-[5px] bg-surface rounded-full md:mb-10 shrink-0">
          {/* Animated traversing dot */}
          <div
            ref={dotRef}
            className="absolute left-1/2 -translate-x-1/2 z-10 md:top-1/2 md:-translate-y-1/2"
          >
            <div className="w-[13px] h-[13px] rounded-full bg-accent shadow-[0_0_12px_rgba(0,102,255,0.40)]" />
            <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30" />
          </div>
        </div>

        {/* Weekly steps */}
        <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-3 flex-1 md:flex-none md:w-[85%] min-w-0">
          {t.deliverySystem.steps.map((step: { num: string; week: string; title: string; desc: string }, i: number) => (
            <div
              key={i}
              className="flex items-center gap-4 md:flex-col md:items-center md:text-center group"
            >
              <div
                className="pipeline-step-dot w-[11px] h-[11px] rounded-full bg-border md:mb-3 transition-all duration-300 shrink-0"
              />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-35 mb-2">{step.week}</div>
                <div className="text-sm font-semibold text-primary mb-1 font-display">{step.title}</div>
                <div className="text-[11px] opacity-45 leading-relaxed hidden md:block">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
