'use client'

import Image from 'next/image'
import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { ArrowUpRight, Clock, Users } from 'lucide-react'

/**
 * Este arreglo contenía además doce imágenes enlazadas en caliente desde
 * cdn.dribbble.com y pixelee.co, rotuladas "Proyecto N" dentro de la sección
 * "Casos de éxito". Eran trabajos de terceros presentados como portafolio
 * propio: infracción de derechos de autor, hotlinking del ancho de banda ajeno
 * y una afirmación falsa sobre la actividad de la agencia. Se retiraron.
 *
 * Quedan las catorce capturas propias de public/images/work/.
 */
const IMAGES = [
  '/images/work/work-01.webp',
  '/images/work/work-02.webp',
  '/images/work/work-03.webp',
  '/images/work/work-04.webp',
  '/images/work/work-05.webp',
  '/images/work/work-06.webp',
  '/images/work/work-07.webp',
  '/images/work/work-08.webp',
  '/images/work/work-09.webp',
  '/images/work/work-10.webp',
  '/images/work/work-11.webp',
  '/images/work/work-12.webp',
  '/images/work/work-13.webp',
  '/images/work/work-14.webp',
]

const duplicated = [...IMAGES, ...IMAGES]
const reversed = [...IMAGES].reverse()
const duplicatedReversed = [...reversed, ...reversed]

interface CaseItem {
  status: string
  title: string
  problem: string
  solution: string
  result: string
  metricLabel: string
  time: string
  users: string
  image: string
  tech: string[]
}

export default function Cases() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()
  const { cases } = t
  const items = (cases as { items?: CaseItem[] }).items || []

  return (
    <section id="deployments" ref={ref} className="py-32 px-6 max-w-full mx-auto scroll-mt-20 overflow-hidden">
      <div data-reveal className="section-label w-full justify-center">
        {cases.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl text-center mx-auto">
        {cases.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14 text-center mx-auto">
        {cases.desc}
      </p>

      <div className="cases-tilt">
        <div data-reveal style={{ '--reveal-delay': '180ms' } as React.CSSProperties} className="cases-carousel cases-carousel--fade-in">
          <div className="cases-carousel__track">
            {duplicated.map((src, i) => (
              <div key={i} className="cases-carousel__slide">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 370px, 44.9vw"
                  className="cases-carousel__img"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="cases-carousel cases-carousel--fade-in cases-carousel--reverse mt-5">
          <div className="cases-carousel__track cases-carousel__track--reverse">
            {duplicatedReversed.map((src, i) => (
              <div key={i} className="cases-carousel__slide">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 370px, 44.9vw"
                  className="cases-carousel__img"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-20 grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 150 + 200}ms` } as React.CSSProperties}
            className="card p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
                item.status === 'dev' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-surface text-primary opacity-50'
              }`}>
                {item.status === 'dev' ? (cases as { status: { dev: string } }).status.dev : (cases as { status: { done: string } }).status.done}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-primary font-display mb-2">{item.title}</h3>

            <div className="mb-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] opacity-40 mb-1">{(cases as { problemLabel: string }).problemLabel}</div>
              <p className="text-xs opacity-55 leading-relaxed">{item.problem}</p>
            </div>

            <div className="mb-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] opacity-40 mb-1">{(cases as { solutionLabel: string }).solutionLabel}</div>
              <p className="text-xs opacity-55 leading-relaxed">{item.solution}</p>
            </div>

            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-primary font-display">{item.result}</div>
                <ArrowUpRight size={16} strokeWidth={2} className="text-emerald-400" />
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] opacity-40 mb-2">{item.metricLabel}</div>
              <div className="flex items-center gap-4 text-[11px] opacity-45">
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} strokeWidth={1.5} />
                  {item.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={11} strokeWidth={1.5} />
                  {item.users}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {('disclaimer' in cases) && (
        <p className="text-[11px] opacity-50 text-center mt-12 max-w-xl mx-auto leading-relaxed">
          {(cases as { disclaimer?: string }).disclaimer}
        </p>
      )}
    </section>
  )
}
