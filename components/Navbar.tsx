'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from './LanguageProvider'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { attachHoverSound, unlockAudio } from '@/lib/sound'

const SECTION_IDS = ['principles', 'delivery', 'deployments', 'capabilities', 'plans', 'faq', 'contact']

export default function Navbar() {
  const { lang, t, setLang } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const cleanup: (() => void)[] = []
    const nav = navRef.current
    if (!nav) return
    const els = nav.querySelectorAll<HTMLElement>('[data-sound]')
    els.forEach((el) => {
      const off = attachHoverSound(el)
      if (off) cleanup.push(off)
    })
    const unlock = () => unlockAudio()
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      cleanup.forEach((off) => off())
    }
  }, [mobileOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -60% 0px' }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const items = SECTION_IDS

  return (
    <>
      <nav
        ref={navRef}
        className={`sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300 ${
          scrolled ? 'py-2.5 glass-nav' : 'py-3.5 bg-white/60 backdrop-blur-[10px] -webkit-backdrop-blur-[10px] border-b border-transparent'
        }`}
      >
        <button
          onPointerDown={() => unlockAudio()}
          onClick={() => scrollTo('hero')}
          className="text-lg font-bold tracking-[-0.02em] text-primary hover:opacity-70 transition-opacity font-display"
        >
          EXTRO
        </button>

        <div className="hidden md:flex items-center gap-5">
          {items.map((key) => (
            <button
              key={key}
              data-sound
              onClick={() => scrollTo(key)}
              className={`text-[13px] font-medium transition-colors ${
                active === key ? 'text-primary' : 'opacity-40 hover:text-primary hover:opacity-70'
              }`}
            >
              {(t.nav as Record<string, string>)[key]}
            </button>
          ))}
          <Link
            href="/blog"
            data-sound
            className="text-[13px] font-medium opacity-40 hover:text-primary hover:opacity-70 transition-colors"
          >
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Glassmorphism language toggle */}
          <div className="hidden sm:flex rounded-full p-0.5 bg-white/30 backdrop-blur-md border border-white/20 shadow-card-sm">
            <button
              data-sound
              onClick={() => setLang('es')}
              aria-pressed={lang === 'es'}
              className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition-all duration-200 ${
                lang === 'es'
                  ? 'bg-white text-primary shadow-card-sm'
                  : 'text-primary opacity-55 hover:opacity-60 hover:bg-white/40'
              }`}
            >
              ES
            </button>
            <button
              data-sound
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition-all duration-200 ${
                lang === 'en'
                  ? 'bg-white text-primary shadow-card-sm'
                  : 'text-primary opacity-55 hover:opacity-60 hover:bg-white/40'
              }`}
            >
              EN
            </button>
          </div>

          {/* Glassmorphism CTA */}
          <button
            data-sound
            onClick={() => scrollTo('contact')}
            className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/20 text-primary shadow-card-sm hover:bg-white/50 hover:shadow-card hover:-translate-y-px transition-all duration-200"
          >
            {t.nav.cta}
          </button>

          <button
            className="md:hidden p-2 opacity-60 hover:opacity-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16 px-6 overflow-y-auto">
          <div className="flex flex-col gap-0.5">
            {items.map((key, i) => (
              <button
                key={key}
                data-sound
                onClick={() => scrollTo(key)}
                style={{ animationDelay: `${i * 40}ms` }}
                className="menu-item text-left text-base text-primary py-3.5 border-b border-border"
              >
                {(t.nav as Record<string, string>)[key]}
              </button>
            ))}
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${items.length * 40}ms` }}
              className="menu-item text-left text-base text-primary py-3.5 border-b border-border"
            >
              Blog
            </Link>
            <div className="flex rounded-full overflow-hidden border border-border w-fit mt-6">
              <button
                onClick={() => { setLang('es'); }}
                aria-pressed={lang === 'es'}
                className={`text-xs px-3 py-1.5 font-semibold transition-colors ${lang === 'es' ? 'bg-accent text-white' : 'opacity-40'}`}
              >
                ES
              </button>
              <button
                onClick={() => { setLang('en'); }}
                aria-pressed={lang === 'en'}
                className={`text-xs px-3 py-1.5 font-semibold transition-colors ${lang === 'en' ? 'bg-accent text-white' : 'opacity-40'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
