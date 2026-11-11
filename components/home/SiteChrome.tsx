import HomeNav from './HomeNav'
import HomeFooter from './HomeFooter'
import HomeFx from './HomeFx'
import { localizedPath, type Locale } from '@/lib/i18n/config'

/**
 * Marco de las páginas internas (blog, legal): mismo nav y footer que la home,
 * con los anclas apuntando a la home del idioma activo.
 */
export default function SiteChrome({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const base = localizedPath('/', lang).replace(/\/$/, '') + '/'
  return (
    <>
      <div className="xp" aria-hidden="true" />
      <HomeNav base={base} />
      <main
        id="main-content"
        tabIndex={-1}
        style={{ position: 'relative', background: '#050505', color: '#fff', minHeight: '100vh', overflow: 'hidden', fontFamily: 'var(--font-inter),system-ui,sans-serif' }}
      >
        {children}
      </main>
      <HomeFooter lang={lang} base={base} />
      <HomeFx />
    </>
  )
}
