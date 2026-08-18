'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from './LanguageProvider'
import { ArrowRight } from 'lucide-react'

export default function ServicesCarousel() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const colsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Registrado en el efecto, no en el módulo: el componente se renderiza en
    // servidor y ScrollTrigger solo tiene sentido en el cliente.
    gsap.registerPlugin(ScrollTrigger)

    const track = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const mm = gsap.matchMedia()
    const tweens: gsap.core.Tween[] = []
    mm.add('(min-width: 768px)', () => {
      const getDistance = () => track.scrollWidth - window.innerWidth + 120
      tweens.push(
        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      )

      if (colsRef.current) {
        const cols = Array.from(colsRef.current.children) as HTMLElement[]
        cols.forEach((col) => {
          tweens.push(
            gsap.to(col, {
              x: () => -getDistance() * 0.35,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${getDistance()}`,
                scrub: 1,
              },
            })
          )
        })
      }
    })

    return () => {
      tweens.forEach((tw) => {
        tw.scrollTrigger?.kill()
        tw.kill()
      })
      mm.revert()
    }
  }, [])

  return (
    <section id="capabilities" ref={sectionRef} className="services-scroll scroll-mt-20">
      <div className="services-scroll__columns" ref={colsRef} aria-hidden="true">
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
      </div>

      <div className="services-head">
        <div className="section-label">
          {t.services.label}
        </div>
        <h2 className="section-title max-w-2xl">{t.services.title}</h2>
        <p className="section-desc">{t.services.desc}</p>
        {(t.services as { scrollHint?: string }).scrollHint && (
          <p className="sm:hidden text-xs text-[var(--text-tertiary)] mt-2" aria-hidden="true">
            {(t.services as { scrollHint: string }).scrollHint}
          </p>
        )}
      </div>

      <div className="services-carousel scroll-fade-x">
        <div className="services-carousel__track" ref={trackRef}>
          {t.services.items.map((item, i) => (
            <article key={i} className="service-slide">
              <span className="service-slide__tag">{item.num} / 04</span>
              <h3 className="service-slide__title">{item.title}</h3>
              <p className="service-slide__desc">{item.desc}</p>
              <span className="service-slide__arrow">
                {t.services.cta}
                <ArrowRight size={15} strokeWidth={2} />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
