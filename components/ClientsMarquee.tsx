'use client'

import { useLang } from './LanguageProvider'
import { Star } from 'lucide-react'
import {
  siTypescript,
  siNextdotjs,
  siNestjs,
  siSpringboot,
  siHtml5,
  siCss,
  siJavascript,
  siReact,
  siTailwindcss,
  siNodedotjs,
  siReactquery,
  siAngular,
  siSwagger,
  siJsonwebtokens,
  siMongodb,
  siPostgresql,
  siDocker,
  siGithub,
} from 'simple-icons'
import { Cloud, Braces, Infinity as InfinityIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type TechItem = { name: string; path?: string; lucide?: LucideIcon }
type ReviewItem = { stars: number; text: string }

const TECH: TechItem[] = [
  { name: 'TypeScript', path: siTypescript.path },
  { name: 'Next.js', path: siNextdotjs.path },
  { name: 'NestJS', path: siNestjs.path },
  { name: 'Java / Spring Boot', path: siSpringboot.path },
  { name: 'HTML', path: siHtml5.path },
  { name: 'CSS', path: siCss.path },
  { name: 'JavaScript', path: siJavascript.path },
  { name: 'React', path: siReact.path },
  { name: 'Tailwind CSS', path: siTailwindcss.path },
  { name: 'Node.js', path: siNodedotjs.path },
  { name: 'React Query', path: siReactquery.path },
  { name: 'Angular', path: siAngular.path },
  { name: 'Swagger', path: siSwagger.path },
  { name: 'JWT Auth', path: siJsonwebtokens.path },
  { name: 'REST APIs', lucide: Braces },
  { name: 'AWS', lucide: Cloud },
  { name: 'MongoDB', path: siMongodb.path },
  { name: 'PostgreSQL', path: siPostgresql.path },
  { name: 'Docker', path: siDocker.path },
  { name: 'CI/CD', lucide: InfinityIcon },
  { name: 'Git / GitHub', path: siGithub.path },
]

export default function ClientsMarquee() {
  const { t } = useLang()

  const outcomes = [...(t.marquee.outcomes as ReviewItem[]), ...(t.marquee.outcomes as ReviewItem[])]
  const tech = [...TECH, ...TECH]

  return (
    <section className="py-12 border-y border-border">
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-40 text-center">{t.marquee.label}</div>
      </div>
      <div className="marquee">
        <div className="marquee__track">
          {outcomes.map((item, i) => (
            <span key={i} className="marquee__item inline-flex items-center gap-2 text-base font-medium opacity-40 whitespace-nowrap">
              <span className="inline-flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={12}
                    fill={s < item.stars ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                    className={s < item.stars ? 'text-amber-400' : 'text-amber-400/30'}
                  />
                ))}
              </span>
              <span className="italic">{item.text}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="marquee marquee--reverse mt-6">
        <div className="marquee__track">
          {tech.map((item, i) => (
            <span key={i} className="marquee__item marquee__item--tech text-lg font-semibold font-display opacity-35">
              {item.path ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d={item.path} />
                </svg>
              ) : (
                item.lucide && <item.lucide size={18} strokeWidth={2} aria-hidden="true" />
              )}
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
