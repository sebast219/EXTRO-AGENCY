'use client'

import { useLang } from './LanguageProvider'
import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'
import { localizedPath } from '@/lib/i18n/config'
import { useReveal } from '@/lib/useReveal'

export default function Footer() {
  const { t, lang } = useLang()
  const ref = useReveal<HTMLElement>()

  const footerLink =
    'text-[15px] text-white opacity-60 hover:opacity-100 transition-opacity duration-200'

  // Adapted from .nav-pill-item (app/globals.css) for the dark footer surface:
  // same shape/size, swapped for the dark-background text/hover tokens.
  const navPill =
    'text-xs font-medium px-2.5 py-1.5 rounded-[14px] text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200'

  // In-page anchors, collapsed from the old Capabilities + part of Resources columns.
  const navLinks = [
    { href: '#capabilities', label: t.footer.links.c1 },
    { href: '#capabilities', label: t.footer.links.c2 },
    { href: '#capabilities', label: t.footer.links.c3 },
    { href: '#capabilities', label: t.footer.links.c4 },
    { href: '#deployments', label: t.footer.links.r1 },
    { href: '#faq', label: t.footer.links.r2 },
    { href: '#delivery', label: t.footer.links.r3 },
  ]

  return (
    <footer ref={ref} className="relative bg-black text-white overflow-hidden">
      <div className="pt-12 md:pt-16 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="max-w-5xl mx-auto">
          <div data-reveal className="mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-white/15 text-white/60 mb-4">
              <span className="w-1 h-1 rounded-full bg-white opacity-45" />
              {t.footer.status}
            </span>
            <div className="text-xl md:text-2xl font-semibold tracking-tight text-white font-display">
              {t.footer.ctaTitle}
            </div>
            <p className="mt-1.5 text-sm text-white/60">{t.footer.ctaSub}</p>
          </div>

          <div
            data-reveal
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
            className="h-px bg-white/15 mb-10"
          />

          <div className="grid sm:grid-cols-[1.6fr_1fr] gap-10 mb-12">
            <div data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] mb-5 text-white/40">
                {t.footer.nav}
              </div>
              <div className="flex flex-wrap gap-1 -ml-2.5">
                {navLinks.map((link, i) => (
                  <Link key={`${link.href}-${i}`} href={link.href} className={navPill}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div data-reveal style={{ '--reveal-delay': '220ms' } as React.CSSProperties}>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] mb-5 text-white/40">
                {t.footer.connect}
              </div>
              <div className="flex flex-col gap-3">
                <Link href={localizedPath('/blog', lang)} className={footerLink}>
                  {t.footer.links.co1}
                </Link>
                <Link href="#contact" className={footerLink}>
                  {t.footer.links.co4}
                </Link>
              </div>
            </div>
          </div>

          <div
            data-reveal
            style={{ '--reveal-delay': '380ms' } as React.CSSProperties}
            className="pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm text-white/60">{t.footer.rights}</span>
              <span className="text-sm text-white/40">{t.footer.remote}</span>
            </div>
            {/*
              /privacy y /sla apuntaban a páginas que nunca existieron: dos 404
              en el pie de todas las páginas. El tratamiento de datos del
              agendamiento está ahora en /terms, así que ese es el único enlace
              legal que se publica.
            */}
            <div className="flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-2 text-sm text-white/60 opacity-60 hover:opacity-100 transition-opacity duration-200">
                {t.footer.builtBy}
                <a
                  href="https://github.com/sebast219"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.footer.links.co2}
                  className="inline-flex hover:text-white"
                >
                  <Github size={14} strokeWidth={1.75} />
                </a>
                <a
                  href="https://www.linkedin.com/in/sebastian-yepes-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.footer.links.co3}
                  className="inline-flex hover:text-white"
                >
                  <Linkedin size={14} strokeWidth={1.75} />
                </a>
              </span>
              <Link
                href={localizedPath('/terms', lang)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {t.footer.links.l2}
              </Link>
            </div>
          </div>

          <div
            data-reveal
            style={{ '--reveal-delay': '480ms' } as React.CSSProperties}
            className="pt-4 select-none pointer-events-none"
            aria-hidden="true"
          >
            <div className="text-center text-[clamp(2.5rem,8vw,6rem)] font-display font-bold leading-none tracking-[-0.05em] text-outline-dark">
              EXTRO
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
