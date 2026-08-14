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
    <section id="delivery" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.deliverySystem.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {t.deliverySystem.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-16">
        {t.deliverySystem.desc}
      </p>

      {/* Pipeline with animated dot */}
      <div
        ref={pipelineRef}
        data-reveal
        style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
        className="relative mb-20"
      >
        {/* Pipeline track */}
        <div className="relative h-1 bg-surface rounded-full mb-10">
          {/* Animated traversing dot */}
          <div
            ref={dotRef}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: '0%' }}
          >
            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(0,102,255,0.40)]" />
            <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30" />
          </div>
        </div>

        {/* Weekly steps */}
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {t.deliverySystem.steps.map((step: { num: string; week: string; title: string; desc: string }, i: number) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div
                className="pipeline-step-dot w-2.5 h-2.5 rounded-full bg-border mb-3 transition-all duration-300"
              />
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-35 mb-2">{step.week}</div>
              <div className="text-[13px] font-semibold text-primary mb-1 font-display">{step.title}</div>
              <div className="text-[10px] opacity-45 leading-relaxed hidden md:block">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Project phases */}
      <div className="space-y-10">
        {t.deliverySystem.phases.map((phase: { num: string; title: string; desc: string }, i: number) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 80 + 500}ms` } as React.CSSProperties}
            className="flex items-start gap-6 group"
          >
            <div className="shrink-0 w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-ink/10 transition-colors">
              <span className="text-[11px] font-bold text-primary tabular-nums font-display opacity-50">{phase.num}</span>
            </div>
            <div className="pt-2.5 flex-1">
              <h3 className="text-base font-semibold text-primary mb-1 font-display">{phase.title}</h3>
              <p className="text-sm leading-relaxed opacity-55 max-w-lg">{phase.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
