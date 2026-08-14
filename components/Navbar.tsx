'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useLang } from './LanguageProvider'
import { attachHoverSound, unlockAudio } from '@/lib/sound'
import { scrollToId } from '@/lib/motion'
import { localizedPath, LOCALES } from '@/lib/i18n/config'

const SECTION_IDS = [
  'pain-points',
  'delivery',
  'deployments',
  'capabilities',
  'plans',
  'pricing-explanation',
  'contact',
  'faq',
] as const

export default function Navbar() {
  const { lang, t, setLang } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>('')
  const navRef = useRef<HTMLElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)

  // --- Sonido de hover ------------------------------------------------------
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const cleanup: (() => void)[] = []
    nav.querySelectorAll<HTMLElement>('[data-sound]').forEach((el) => {
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

  // --- Fondo del navbar -----------------------------------------------------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /**
   * M-5: sección activa con IntersectionObserver.
   *
   * Antes, cada evento de scroll leía `offsetTop` de los ocho elementos. Cada
   * lectura fuerza al navegador a recalcular el layout, así que el gesto de
   * scroll —el momento más sensible al jank— disparaba ocho reflows síncronos.
   * El observer entrega el mismo dato de forma asíncrona y sin tocar el layout.
   */
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (!sections.length) return

    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        }
        if (!visible.size) return
        // La sección con mayor superficie visible gana.
        const [topId] = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]
        setActive(topId)
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /**
   * M-10: el menú móvil era un div sin rol, sin retención de foco y sin devolver
   * el foco al cerrarse. Con teclado se podía tabular "detrás" del panel.
   */
  useEffect(() => {
    if (!mobileOpen) return
    const dialog = dialogRef.current
    if (!dialog) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
      )

    focusables()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        return
      }
      if (e.key !== 'Tab') return

      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const opener = openerRef.current

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      ;(previouslyFocused ?? opener)?.focus()
    }
  }, [mobileOpen])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    scrollToId(id)
  }

  const navLabel = (key: string) => (t.nav as Record<string, string>)[key]

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: scrolled ? '8px' : '18px' }}
      >
        <nav
          aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}
          className={`dynamic-island pointer-events-auto ${scrolled ? 'dynamic-island--scrolled' : ''}`}
        >
          <button
            type="button"
            onPointerDown={() => unlockAudio()}
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.03em] text-white shrink-0 font-display opacity-90 hover:opacity-100 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 24px fijo, sin variantes; next/image aquí solo añadiría una petición al optimizador */}
            <img src="/icon.png" alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
            EXTRO
          </button>

          <div className="hidden md:flex items-center gap-1">
            {SECTION_IDS.map((key) => (
              <button
                key={key}
                type="button"
                data-sound
                onClick={() => scrollTo(key)}
                aria-current={active === key ? 'true' : undefined}
                className={`nav-pill-item ${active === key ? 'nav-pill-item--active' : ''}`}
              >
                {navLabel(key)}
              </button>
            ))}
            <Link href={localizedPath('/blog', lang)} data-sound className="nav-pill-item">
              Blog
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="flex rounded-full bg-white/10 p-[2px]" role="group" aria-label="Idioma">
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  data-sound
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-colors duration-200 ${
                    lang === code ? 'bg-white text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              data-sound
              onClick={() => scrollTo('contact')}
              className="flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200"
            >
              {t.nav.cta}
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          <button
            ref={openerRef}
            type="button"
            className="md:hidden p-1.5 -mr-1 text-white/80 hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? (lang === 'es' ? 'Cerrar menú' : 'Close menu') : lang === 'es' ? 'Abrir menú' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'es' ? 'Menú' : 'Menu'}
          className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 overflow-y-auto"
        >
          <div className="flex flex-col gap-0.5 max-w-sm mx-auto">
            {SECTION_IDS.map((key, i) => (
              <button
                key={key}
                type="button"
                data-sound
                onClick={() => scrollTo(key)}
                style={{ animationDelay: `${i * 40}ms` }}
                className="menu-item text-left text-lg text-white/85 hover:text-white py-3.5 border-b border-white/10 font-medium"
              >
                {navLabel(key)}
              </button>
            ))}
            <Link
              href={localizedPath('/blog', lang)}
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${SECTION_IDS.length * 40}ms` }}
              className="menu-item text-left text-lg text-white/85 hover:text-white py-3.5 border-b border-white/10 font-medium"
            >
              Blog
            </Link>

            <div className="flex items-center gap-3 mt-8">
              <div className="flex rounded-full bg-white/10 p-[2px]" role="group" aria-label="Idioma">
                {LOCALES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                      lang === code ? 'bg-white text-black' : 'text-white/70'
                    }`}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => scrollTo('contact')}
                className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full bg-white text-black"
              >
                {t.nav.cta}
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
