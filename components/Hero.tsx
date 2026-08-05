'use client'

import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useLang } from './LanguageProvider'
import { ArrowDown, ArrowRight } from 'lucide-react'

const HERO_IMAGES = [
  { src: '/images/work/work-01.webp', alt: 'Panel de administración de un SaaS construido por EXTRO' },
  { src: '/images/work/work-02.webp', alt: 'Dashboard de métricas en tiempo real de un cliente EXTRO' },
  { src: '/images/work/work-03.webp', alt: 'Interfaz de ecommerce con pagos integrados, proyecto EXTRO' },
  { src: '/images/work/work-04.webp', alt: 'Aplicación web de reservas desarrollada por EXTRO' },
  { src: '/images/work/work-05.webp', alt: 'Chatbot con IA integrado en WhatsApp, proyecto EXTRO' },
  { src: '/images/work/work-06.webp', alt: 'Landing page de producto construida por EXTRO' },
  { src: '/images/work/work-07.webp', alt: 'Panel de analítica con predicciones de IA, trabajo de EXTRO' },
  { src: '/images/work/work-08.webp', alt: 'Tienda virtual con inventario automático, proyecto EXTRO' },
  { src: '/images/work/work-09.webp', alt: 'Plataforma de servicios con registro y pagos, de EXTRO' },
  { src: '/images/work/work-10.webp', alt: 'Dashboard de ventas en tiempo real, proyecto EXTRO' },
  { src: '/images/work/work-11.webp', alt: 'Aplicación móvil responsive construida por EXTRO' },
  { src: '/images/work/work-12.webp', alt: 'Sistema de automatización de pedidos, proyecto EXTRO' },
  { src: '/images/work/work-13.webp', alt: 'Backoffice con panel de métricas, trabajo de EXTRO' },
  { src: '/images/work/work-14.webp', alt: 'Interfaz de producto SaaS en producción, de EXTRO' },
]

interface FloatConfig {
  top: string
  left: string
  width: string
  height: string
  rot: number
  depth: number
  originX: number
  originY: number
  delay: number
  hideOnMobile?: boolean
}

const FLOATS: FloatConfig[] = [
  { top: '2%', left: '3%', width: '160px', height: '120px', rot: -8, depth: 0.4, originX: -1, originY: -1, delay: 0 },
  { top: '5%', left: '80%', width: '180px', height: '130px', rot: 6, depth: 0.6, originX: 1, originY: -1, delay: 100 },
  { top: '3%', left: '55%', width: '120px', height: '100px', rot: -3, depth: 0.3, originX: 0, originY: -1, delay: 200, hideOnMobile: true },
  { top: '60%', left: '2%', width: '170px', height: '110px', rot: 5, depth: 0.5, originX: -1, originY: 1, delay: 150 },
  { top: '65%', left: '82%', width: '140px', height: '120px', rot: -6, depth: 0.45, originX: 1, originY: 1, delay: 250 },
  { top: '72%', left: '12%', width: '130px', height: '100px', rot: 4, depth: 0.35, originX: -1, originY: 1, delay: 50 },
  { top: '50%', left: '88%', width: '110px', height: '90px', rot: -4, depth: 0.3, originX: 1, originY: 0, delay: 300 },
  { top: '30%', left: '5%', width: '100px', height: '80px', rot: -5, depth: 0.25, originX: -1, originY: 0, delay: 180 },
  { top: '4%', left: '30%', width: '150px', height: '110px', rot: 5, depth: 0.5, originX: 0, originY: -1, delay: 320, hideOnMobile: true },
  { top: '15%', left: '68%', width: '110px', height: '85px', rot: -7, depth: 0.4, originX: 1, originY: -1, delay: 340, hideOnMobile: true },
  { top: '32%', left: '88%', width: '120px', height: '95px', rot: 7, depth: 0.35, originX: 1, originY: 0, delay: 380 },
  { top: '42%', left: '2%', width: '130px', height: '90px', rot: -4, depth: 0.3, originX: -1, originY: 0, delay: 300 },
  { top: '78%', left: '32%', width: '140px', height: '105px', rot: -6, depth: 0.45, originX: 0, originY: 1, delay: 420, hideOnMobile: true },
  { top: '80%', left: '58%', width: '160px', height: '115px', rot: 4, depth: 0.55, originX: 0, originY: 1, delay: 360, hideOnMobile: true },
]

// Distancia (px) desde el centro de la tarjeta en la que reacciona al mouse
const REACTION_RADIUS = 180
const REACTION_HYSTERESIS = 24

export default function Hero() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const colsRef = useRef<HTMLDivElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)

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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const section = sectionRef.current
    if (!section) return

    const titleEls = section.querySelectorAll<HTMLElement>('.hero-word')
    const subtitleEl = section.querySelector<HTMLElement>('.hero-subtitle')
    const ctaEl = section.querySelector<HTMLElement>('.hero-ctas')
    const badgesEl = section.querySelector<HTMLElement>('.hero-badges')
    const scrollEl = section.querySelector<HTMLElement>('.hero-scroll-hint')
    const floatEls = floatsRef.current?.querySelectorAll<HTMLElement>('.hero-float-card')

    const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'

    floatEls?.forEach((el, i) => {
      const cfg = FLOATS[i]
      el.style.opacity = '0'
      el.style.transform = `rotate(${cfg.rot}deg) translate(${cfg.originX * 40}px, ${cfg.originY * 40}px) scale(0.85)`
      el.style.filter = 'blur(6px)'
      el.animate(
        [
          { opacity: 0, transform: `rotate(${cfg.rot}deg) translate(${cfg.originX * 40}px, ${cfg.originY * 40}px) scale(0.85)`, filter: 'blur(6px)' },
          { opacity: 0.75, transform: `rotate(${cfg.rot}deg) translate(0, 0) scale(1)`, filter: 'blur(0px)' },
        ],
        { duration: 900, delay: cfg.delay, easing: ease, fill: 'forwards' }
      )
    })

    titleEls.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(32px)'
      el.style.filter = 'blur(8px)'
      el.animate(
        [
          { opacity: 0, transform: 'translateY(32px)', filter: 'blur(8px)' },
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
        ],
        { duration: 700, delay: 300 + i * 70, easing: ease, fill: 'forwards' }
      )
    })

    if (subtitleEl) {
      subtitleEl.style.opacity = '0'
      subtitleEl.animate(
        [
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 0.6, transform: 'translateY(0)' },
        ],
        { duration: 600, delay: 700, easing: ease, fill: 'forwards' }
      )
    }

    if (ctaEl) {
      ctaEl.style.opacity = '0'
      ctaEl.animate(
        [
          { opacity: 0, transform: 'translateY(16px) scale(0.95)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { duration: 500, delay: 900, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' }
      )
    }

    if (badgesEl) {
      badgesEl.style.opacity = '0'
      badgesEl.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 500, delay: 1100, easing: ease, fill: 'forwards' }
      )
    }

    if (scrollEl) {
      scrollEl.style.opacity = '0'
      scrollEl.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 500, delay: 1500, easing: ease, fill: 'forwards' }
      )
    }
  }, [titleWords, highlightWords])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cols = colsRef.current
    const floats = floatsRef.current
    if (!cols && !floats) return

    let raf: number
    const onMouseMove = (e: MouseEvent) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2

        if (cols) {
          Array.from(cols.children).forEach((col, i) => {
            const el = col as HTMLElement
            const depth = 0.5 + (i / 7) * 0.5
            el.style.transform = `translate(${x * 8 * depth}px, ${y * 4 * depth}px)`
          })
        }

        if (floats) {
          Array.from(floats.children).forEach((el) => {
            const float = el as HTMLElement
            const depth = parseFloat(float.dataset.depth || '0.5')
            float.style.transform = `translate(${x * 20 * depth}px, ${y * 12 * depth}px)`
          })
        }
      })
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center pt-28 pb-20 px-6 overflow-hidden"
    >
      <div ref={colsRef} className="hero-columns" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="hero-columns__col" />
        ))}
      </div>

      <div ref={floatsRef} className="hero-floats" aria-hidden="true">
        {FLOATS.map((cfg, i) => (
          <div
            key={i}
            className={`hero-float-card ${cfg.hideOnMobile ? 'hidden md:block' : ''}`}
            data-depth={cfg.depth}
            style={{
              top: cfg.top,
              left: cfg.left,
              width: cfg.width,
              height: cfg.height,
              transform: `rotate(${cfg.rot}deg)`,
            } as React.CSSProperties}
          >
            <img
              src={HERO_IMAGES[i].src}
              alt={HERO_IMAGES[i].alt}
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="hero-float-img"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        <h1 className="font-display font-semibold text-primary leading-[0.96] tracking-[-0.04em] mb-6 text-[clamp(2.6rem,6.5vw,4.75rem)]">
          {titleWords.map((word, i) => (
            <Fragment key={`w-${i}`}>
              <span className="hero-word inline-block">{word}</span>
              {' '}
            </Fragment>
          ))}
          {highlightWords.length > 0 && (
            <span className="hero-word block mt-2 opacity-45 text-[clamp(1.6rem,3.5vw,2.5rem)]">
              {highlightWords.map((word, i) => (
                <Fragment key={`h-${i}`}>
                  <span className="inline-block">{word}</span>
                  {' '}
                </Fragment>
              ))}
            </span>
          )}
        </h1>

        <p className="hero-subtitle text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-10" style={{ opacity: 0.60 }}>
          {t.hero.subtitle}
        </p>

        <div className="hero-ctas flex flex-wrap items-center justify-center gap-4 mb-12">
          <button onClick={() => scrollTo('contact')} className="btn btn-primary px-8 py-4">
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

        <div className="hero-badges flex flex-wrap items-center justify-center gap-3">
          {t.hero.badges.map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-border text-primary opacity-55"
            >
              <span className="w-1 h-1 rounded-full bg-ink opacity-45" />
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 z-10 scroll-hint" aria-hidden="true">
        <ArrowDown size={16} strokeWidth={1.5} style={{ opacity: 0.30 }} />
      </div>
    </section>
  )
}
