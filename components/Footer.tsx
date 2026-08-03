'use client'

import { useLang } from './LanguageProvider'
import Link from 'next/link'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="border-t border-border py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <div className="text-lg font-bold tracking-[-0.02em] text-primary mb-3 font-display">EXTRO</div>
            <p className="text-xs opacity-40 leading-relaxed max-w-xs">{t.footer.desc}</p>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-50" />
              <span className="text-[10px] opacity-45">{t.footer.status}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-45 mb-4">{t.footer.capabilities}</div>
            <div className="flex flex-col gap-2">
              <Link href="#capabilities" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.c1}</Link>
              <Link href="#capabilities" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.c2}</Link>
              <Link href="#capabilities" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.c3}</Link>
              <Link href="#capabilities" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.c4}</Link>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-45 mb-4">{t.footer.resources}</div>
            <div className="flex flex-col gap-2">
              <Link href="#deployments" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.r1}</Link>
              <Link href="#faq" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.r2}</Link>
              <Link href="#delivery" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.r3}</Link>
              <Link href="#tech" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.r4}</Link>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-45 mb-4">{t.footer.company}</div>
            <div className="flex flex-col gap-2 mb-5">
              <Link href="/blog" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.co1}</Link>
              <a href="#" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.co2}</a>
              <a href="#" className="text-sm opacity-40 hover:opacity-60 transition-opacity">{t.footer.links.co3}</a>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-45 mb-4">{t.footer.legal}</div>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm opacity-50 hover:opacity-50 transition-opacity">{t.footer.links.l1}</a>
              <a href="#" className="text-sm opacity-50 hover:opacity-50 transition-opacity">{t.footer.links.l2}</a>
              <a href="#" className="text-sm opacity-50 hover:opacity-50 transition-opacity">{t.footer.links.l3}</a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs opacity-45">{t.footer.rights}</span>
          <span className="text-xs opacity-40">{t.footer.remote}</span>
        </div>
      </div>
    </footer>
  )
}
