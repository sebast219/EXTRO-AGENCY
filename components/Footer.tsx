'use client'

import { useLang } from './LanguageProvider'

export default function Footer() {
  const { t } = useLang()

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="text-lg font-medium tracking-[0.15em] text-primary mb-3">
              EX<span className="opacity-40">·</span>TRON
            </div>
            <p className="text-sm text-secondary leading-relaxed">{t.footer.desc}</p>
          </div>

          <div>
            <div className="text-xs font-medium text-primary uppercase tracking-wider mb-4">{t.footer.services}</div>
            <div className="space-y-2.5">
              {['s1', 's2', 's3', 's4'].map((key) => (
                <button
                  key={key}
                  onClick={() => scrollTo('services')}
                  className="block text-sm text-secondary hover:text-primary transition-colors"
                >
                  {(t.footer.links as Record<string, string>)[key]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-primary uppercase tracking-wider mb-4">{t.footer.explore}</div>
            <div className="space-y-2.5">
              {[
                { key: 'e1', id: 'cases' },
                { key: 'e2', id: 'faq' },
                { key: 'e3', id: 'process' },
                { key: 'e4', id: 'contact' },
              ].map(({ key, id }) => (
                <button
                  key={key}
                  onClick={() => scrollTo(id)}
                  className="block text-sm text-secondary hover:text-primary transition-colors"
                >
                  {(t.footer.links as Record<string, string>)[key]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-primary uppercase tracking-wider mb-4">{t.footer.contact}</div>
            <div className="space-y-2.5 text-sm text-secondary">
              <div>contacto@extron.dev</div>
              <div>Medellín, Colombia</div>
              <div>{t.footer.remote}</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-border text-xs text-tertiary">
          {t.footer.rights}
        </div>
      </div>
    </footer>
  )
}
