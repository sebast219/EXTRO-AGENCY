'use client'

import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Github, Linkedin } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  skills: string
  photo: string
  github: string
  linkedin: string
}

export default function TeamSection() {
  const { t } = useLang()
  const ref = useReveal<HTMLElement>()

  const members = 'members' in t.team ? (t.team as { members: TeamMember[] }).members : []

  return (
    <section id="team" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {(t.team as { label: string }).label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-2xl">
        {(t.team as { title: string }).title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {(t.team as { desc: string }).desc}
      </p>

      <div className="flex justify-center">
        {members.map((member, i) => (
          <div
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${i * 120 + 180}ms` } as React.CSSProperties}
            className="card p-8 text-center max-w-md w-full"
          >
            <img
              src={member.photo}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-5 object-cover ring-2 ring-border"
              loading="lazy"
            />
            <div className="text-xl font-semibold text-primary font-display">{member.name}</div>
            <div className="text-sm opacity-60 mt-1 mb-1">{member.role}</div>
            <div className="text-xs opacity-40 mb-5 leading-relaxed">{member.skills}</div>

            <div className="flex items-center justify-center gap-3">
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs opacity-50 hover:opacity-100 transition-opacity"
              >
                <Github size={15} strokeWidth={1.5} />
                GitHub
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs opacity-50 hover:opacity-100 transition-opacity"
              >
                <Linkedin size={15} strokeWidth={1.5} />
                LinkedIn
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
