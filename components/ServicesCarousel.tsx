'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from './LanguageProvider'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function ServicesCarousel() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const colsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const getDistance = () => track.scrollWidth - window.innerWidth + 120
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

      // Columnas decorativas con parallax (se mueven más lento)
      if (colsRef.current) {
        const cols = Array.from(colsRef.current.children) as HTMLElement[]
        cols.forEach((col) => {
          gsap.to(col, {
            x: () => -getDistance() * 0.45,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${getDistance()}`,
              scrub: 1,
            },
          })
        })
      }
    })

    return () => {
      mm.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section id="services" ref={sectionRef} className="services-scroll scroll-mt-20">
      <div className="services-scroll__columns" ref={colsRef} aria-hidden="true">
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
        <div className="services-scroll__column" />
      </div>

      <div className="services-head">
        <div className="section-label">{t.services.label}</div>
        <h2 className="section-title max-w-2xl">{t.services.title}</h2>
        <p className="section-desc">{t.services.desc}</p>
      </div>

      <div className="services-carousel">
        <div className="services-carousel__track" ref={trackRef}>
          {t.services.items.map((item, i) => (
            <article key={i} className="service-slide">
              <span className="service-slide__tag">{item.tag}</span>
              <span className="service-slide__num">{item.num}</span>
              <h3 className="service-slide__title">{item.title}</h3>
              <p className="service-slide__desc">{item.desc}</p>
              <span className="service-slide__arrow">
                {t.services.cta}
                <ArrowRight size={16} />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
