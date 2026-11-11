'use client'

import { createContext, useContext, useMemo, useState, useTransition, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
 *
 * El diccionario de traducciones salió del contexto: ningún componente lo
 * consumía y metía 26,6 KB de strings en el bundle de cliente de todas las
 * páginas. Cada componente recibe su copy desde el servidor o lo importa de
 * `lib/i18n/*`.
 */

type LangContextValue = {
  lang: Locale
  /** Idioma al que se está cambiando mientras llega el contenido nuevo (null si no hay cambio en curso). */
  pendingLang: Locale | null
  setLang: (lang: Locale) => void
  /** Ruta pública equivalente en el otro idioma, para el enlace del selector. */
  pathIn: (lang: Locale) => string
}

const LangContext = createContext<LangContextValue | undefined>(undefined)

export function LanguageProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [pendingLang, setPendingLang] = useState<Locale | null>(null)
  const [, startTransition] = useTransition()

  const value = useMemo<LangContextValue>(() => {
    const basePath = stripLocale(pathname || '/')

    const pathIn = (target: Locale) => localizedPath(basePath, target)

    return {
      lang,
      pendingLang: pendingLang !== lang ? pendingLang : null,
      pathIn,
      setLang: (target: Locale) => {
        if (target === lang) return
        // Cookie de preferencia: la middleware la usa para respetar la elección
        // en visitas posteriores. Solo se escribe aquí, nunca al autodetectar.
        document.cookie = `extro-lang=${target}; path=/; max-age=31536000; samesite=lax`
        // Cambio reactivo: navegación suave sin salto al inicio. replace evita llenar el
        // historial con un paso por cada cambio de idioma.
        setPendingLang(target)
        startTransition(() => {
          router.replace(pathIn(target), { scroll: false })
        })
      },
    }
  }, [lang, pathname, pendingLang, router])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang debe usarse dentro de LanguageProvider')
  return ctx
}

export { DEFAULT_LOCALE }
export type { Locale }
