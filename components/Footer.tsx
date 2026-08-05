'use client'

import { useLang } from './LanguageProvider'
import Link from 'next/link'

export default function Footer() {
  const { t } = useLang()

  const footerLink =
    'text-[15px] text-primary opacity-60 hover:opacity-100 transition-opacity duration-200'

  return (
    <footer className="relative bg-surface text-primary overflow-hidden">
      <div className="pt-12 md:pt-16 px-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <div className="text-xl md:text-2xl font-semibold tracking-tight text-primary font-display">
              {t.footer.ctaTitle}
            </div>
            <p className="text-primary opacity-50 mt-1.5 text-sm">{t.footer.ctaSub}</p>
          </div>

          <div className="h-px bg-border mb-10" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-primary opacity-40 mb-5">
                {t.footer.capabilities}
              </div>
              <div className="flex flex-col gap-3">
                <Link href="#capabilities" className={footerLink}>{t.footer.links.c1}</Link>
                <Link href="#capabilities" className={footerLink}>{t.footer.links.c2}</Link>
                <Link href="#capabilities" className={footerLink}>{t.footer.links.c3}</Link>
                <Link href="#capabilities" className={footerLink}>{t.footer.links.c4}</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-primary opacity-40 mb-5">
                {t.footer.resources}
              </div>
              <div className="flex flex-col gap-3">
                <Link href="#deployments" className={footerLink}>{t.footer.links.r1}</Link>
                <Link href="#faq" className={footerLink}>{t.footer.links.r2}</Link>
                <Link href="#delivery" className={footerLink}>{t.footer.links.r3}</Link>
                <Link href="/blog" className={footerLink}>{t.footer.links.co1}</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-primary opacity-40 mb-5">
                {t.footer.company}
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/sebast219"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLink}
                >
                  {t.footer.links.co2}
                </a>
                <a
                  href="https://www.linkedin.com/in/sebastian-yepes-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLink}
                >
                  {t.footer.links.co3}
                </a>
                <Link href="#contact" className={footerLink}>{t.footer.links.co4}</Link>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm text-primary opacity-50">{t.footer.rights}</span>
              <span className="text-sm text-primary opacity-40">{t.footer.remote}</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-primary opacity-40 hover:opacity-100 transition-opacity">{t.footer.links.l1}</Link>
              <Link href="/terms" className="text-sm text-primary opacity-40 hover:opacity-100 transition-opacity">{t.footer.links.l2}</Link>
              <Link href="/sla" className="text-sm text-primary opacity-40 hover:opacity-100 transition-opacity">{t.footer.links.l3}</Link>
            </div>
          </div>

          <div className="pt-4 select-none pointer-events-none" aria-hidden="true">
            <div className="text-center text-[clamp(2.5rem,8vw,6rem)] font-display font-bold leading-none tracking-[-0.05em] text-outline opacity-60">
              EXTRO
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
