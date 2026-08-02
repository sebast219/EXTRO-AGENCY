'use client'

import { useState } from 'react'
import { useLang } from './LanguageProvider'
import { Menu, X, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const { lang, t, setLang } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-border">
        <button onClick={() => scrollTo('hero')} className="text-xl font-medium tracking-[0.15em] text-primary hover:opacity-80 transition-opacity">
          EX<span className="opacity-40">·</span>TRON
        </button>

        <div className="hidden md:flex items-center gap-8">
          {['services', 'plans', 'process', 'cases', 'faq', 'contact'].map((key) => (
            <button
              key={key}
              onClick={() => scrollTo(key)}
              className="text-sm text-secondary hover:text-primary transition-colors"
            >
              {(t.nav as Record<string, string>)[key]}
            </button>
          ))}
          <Link
            href="/blog"
            className="text-sm text-secondary hover:text-primary transition-colors"
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
              onClick={() => setLang('es')}
              className={`text-xs px-2.5 py-1.5 transition-colors ${lang === 'es' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'}`}
            >
              ES
            </button>
            <button
              onClick={() => setLang('en')}
              className={`text-xs px-2.5 py-1.5 transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'}`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => scrollTo('contact')}
            className="hidden md:block text-sm px-4 py-2 bg-primary text-white rounded-lg hover:opacity-85 transition-opacity"
          >
            {t.nav.cta}
          </button>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6">
          <div className="flex flex-col gap-1">
            {['services', 'plans', 'process', 'cases', 'faq', 'contact'].map((key) => (
              <button
                key={key}
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
