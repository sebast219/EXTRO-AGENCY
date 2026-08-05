'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { ArrowUpRight, Clock, Users } from 'lucide-react'

const IMAGES = [
  'https://pixelee.co/assets/images/services/villa-del-mar.jpg',
  'https://cdn.dribbble.com/userupload/20585018/file/still-3a3c949581639300f2b07079424abbf5.png?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/17364214/file/original-f1ef8cd03a460de6387f5920888d2986.png?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/14588077/file/original-807cefefe2dcdd123c259dc966e0ba71.png?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/17878524/file/still-436e5e7ef532714fc03624b9a657dfb9.png?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/15526772/file/original-0184fa2dc8eb33963b71e52fc7251a14.jpg?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/11770325/file/still-ecf4b75d88b1556d13668e5a6d103407.png?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/14801695/file/original-7324d6ea7c6cac4585760efb73a7d75c.png?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/16011562/file/original-b3962c825f31d8f59a286e836ef96276.png?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/11780960/file/original-b5723a4f9fc7c5fd7fb8b94ddc065b35.png?format=webp&resize=450x338&vertical=center',
  'https://cdn.dribbble.com/userupload/14912901/file/original-54f35b2c851a539d2c2bf4ffe7d12379.png?format=webp&resize=400x300&vertical=center',
  'https://cdn.dribbble.com/userupload/15023899/file/original-f1d09c3fec6bb0b54841951f7dc43d47.png?format=webp&resize=450x338&vertical=center',
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
                <img
                  src={src}
                  alt={`Proyecto ${(i % IMAGES.length) + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="cases-carousel__img"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="cases-carousel cases-carousel--fade-in cases-carousel--reverse mt-5">
          <div className="cases-carousel__track cases-carousel__track--reverse">
            {duplicatedReversed.map((src, i) => (
              <div key={i} className="cases-carousel__slide">
                <img
                  src={src}
                  alt={`Proyecto ${(i % IMAGES.length) + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="cases-carousel__img"
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
