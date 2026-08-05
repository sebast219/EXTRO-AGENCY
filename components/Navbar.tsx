'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from './LanguageProvider'
import { Menu, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { attachHoverSound, unlockAudio } from '@/lib/sound'

const SECTION_IDS = ['pain-points', 'delivery', 'deployments', 'capabilities', 'plans', 'pricing-explanation', 'scope', 'quote', 'faq', 'contact']

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
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      const viewportTop = window.scrollY + 120
      let current = SECTION_IDS[0]

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.offsetTop <= viewportTop) {
          current = id
        } else {
          break
        }
      }

      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: scrolled ? '8px' : '18px' }}
      >
        <nav
          className={`dynamic-island pointer-events-auto ${
            scrolled ? 'dynamic-island--scrolled' : ''
          }`}
        >
          <button
            onPointerDown={() => unlockAudio()}
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.03em] text-white shrink-0 font-display opacity-90 hover:opacity-100 transition-opacity"
          >
            <img
              src="/icon.png"
              alt="EXTRO"
              className="w-6 h-6 rounded-full object-cover"
            />
            EXTRO
          </button>

          <div className="hidden md:flex items-center gap-1">
            {SECTION_IDS.map((key) => (
              <button
                key={key}
                data-sound
                onClick={() => scrollTo(key)}
                className={`nav-pill-item ${
                  active === key ? 'nav-pill-item--active' : ''
                }`}
              >
                {(t.nav as Record<string, string>)[key]}
              </button>
            ))}
            <Link
              href="/blog"
              data-sound
              className="nav-pill-item"
            >
              Blog
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="flex rounded-full bg-white/10 p-[2px]">
              <button
                data-sound
                onClick={() => setLang('es')}
                aria-pressed={lang === 'es'}
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-all duration-200 ${
                  lang === 'es'
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                ES
              </button>
              <button
                data-sound
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                EN
              </button>
            </div>

            <button
              data-sound
              onClick={() => scrollTo('contact')}
              className="flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-white/90 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
            >
              {t.nav.cta}
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          <button
            className="md:hidden p-1.5 -mr-1 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 overflow-y-auto">
          <div className="flex flex-col gap-0.5 max-w-sm mx-auto">
            {SECTION_IDS.map((key, i) => (
              <button
                key={key}
                data-sound
                onClick={() => scrollTo(key)}
                style={{ animationDelay: `${i * 40}ms` }}
                className="menu-item text-left text-lg text-white/80 hover:text-white py-3.5 border-b border-white/10 font-medium"
              >
                {(t.nav as Record<string, string>)[key]}
              </button>
            ))}
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${SECTION_IDS.length * 40}ms` }}
              className="menu-item text-left text-lg text-white/80 hover:text-white py-3.5 border-b border-white/10 font-medium"
            >
              Blog
            </Link>
            <div className="flex items-center gap-3 mt-8">
              <div className="flex rounded-full bg-white/10 p-[2px]">
                <button
                  onClick={() => setLang('es')}
                  aria-pressed={lang === 'es'}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                    lang === 'es' ? 'bg-white text-black' : 'text-white/50'
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLang('en')}
                  aria-pressed={lang === 'en'}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                    lang === 'en' ? 'bg-white text-black' : 'text-white/50'
                  }`}
                >
                  EN
                </button>
              </div>
              <button
                onClick={() => scrollTo('contact')}
                className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full bg-white text-black"
              >
                {t.nav.cta}
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
