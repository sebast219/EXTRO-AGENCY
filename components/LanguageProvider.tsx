'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getTranslations, type Translations } from '@/lib/i18n'
import { DEFAULT_LOCALE, localizedPath, stripLocale, type Locale } from '@/lib/i18n/config'

/**
 * M-2: el idioma llega desde el servidor por props y ya no se descubre en un
 * useEffect.
 *
 * Antes el estado arrancaba en 'es', un efecto leía navigator.language y
 * localStorage, y recién entonces cambiaba: el usuario angloparlante veía un
 * parpadeo y el HTML servido siempre estaba en español. Cambiar de idioma
 * ahora navega a la URL del otro idioma, que es lo que hace que el contenido en
 * inglés exista para el buscador (M-3).
 */

type LangContextValue = {
  lang: Locale
  t: Translations
  setLang: (lang: Locale) => void
  /** Ruta pública equivalente en el otro idioma, para el enlace del selector. */
  pathIn: (lang: Locale) => string
}

const LangContext = createContext<LangContextValue | undefined>(undefined)

export function LanguageProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const value = useMemo<LangContextValue>(() => {
    const basePath = stripLocale(pathname || '/')

    const pathIn = (target: Locale) => localizedPath(basePath, target)

    return {
      lang,
      t: getTranslations(lang),
      pathIn,
      setLang: (target: Locale) => {
        if (target === lang) return
        // Cookie de preferencia: la middleware la usa para respetar la elección
        // en visitas posteriores a la raíz.
        document.cookie = `extro-lang=${target}; path=/; max-age=31536000; samesite=lax`
        router.push(pathIn(target))
      },
    }
  }, [lang, pathname, router])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang debe usarse dentro de LanguageProvider')
  return ctx
}

export { DEFAULT_LOCALE }
export type { Locale }
