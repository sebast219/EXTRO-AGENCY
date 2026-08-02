'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from './LanguageProvider'
import { Menu, X, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { attachHoverSound, unlockAudio } from '@/lib/sound'

export default function Navbar() {
  const { lang, t, setLang } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
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
    // Primer clic en cualquier parte desbloquea el audio (política de autoplay)
    const unlock = () => unlockAudio()
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      cleanup.forEach((off) => off())
    }
  }, [mobileOpen])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const items = ['services', 'plans', 'process', 'cases', 'faq', 'contact']

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-border"
      >
        <button
          onPointerDown={() => unlockAudio()}
          onClick={() => scrollTo('hero')}
          className="text-xl font-medium tracking-[0.15em] text-primary hover:opacity-80 transition-opacity font-display"
        >
          EX<span className="opacity-40">·</span>TRON
        </button>

        <div className="hidden md:flex items-center gap-8">
          {items.map((key) => (
            <button
              key={key}
              data-sound
              onClick={() => scrollTo(key)}
              className="text-sm text-secondary hover:text-brand-blue transition-colors"
            >
              {(t.nav as Record<string, string>)[key]}
            </button>
          ))}
          <Link
            href="/blog"
            data-sound
            className="text-sm text-secondary hover:text-brand-blue transition-colors"
          >
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 border border-border rounded-md text-tertiary hover:text-primary hover:border-primary transition-colors"
          >
            <BarChart3 size={14} />
            {t.nav.admin}
          </Link>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              data-sound
              onClick={() => setLang('es')}
              className={`text-xs px-2.5 py-1.5 transition-colors ${lang === 'es' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'}`}
            >
              ES
            </button>
            <button
              data-sound
              onClick={() => setLang('en')}
              className={`text-xs px-2.5 py-1.5 transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'}`}
            >
              EN
            </button>
          </div>
          <button
            data-sound
            onClick={() => scrollTo('contact')}
            className="hidden md:block btn btn-primary px-5 py-2.5 text-sm"
          >
            {t.nav.cta}
          </button>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {items.map((key) => (
              <button
                key={key}
                data-sound
                onClick={() => scrollTo(key)}
                className="text-left text-lg text-secondary hover:text-primary py-3 border-b border-border"
              >
                {(t.nav as Record<string, string>)[key]}
              </button>
            ))}
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="text-left text-lg text-secondary hover:text-primary py-3 border-b border-border"
            >
              Blog
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-left text-lg text-secondary hover:text-primary py-3 border-b border-border flex items-center gap-2"
            >
              <BarChart3 size={18} />
              {t.nav.admin}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
