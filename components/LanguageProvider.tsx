'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lang, Translations, getTranslations, detectLanguage } from '@/lib/i18n'

interface LangContextType {
  lang: Lang
  t: Translations
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')

  useEffect(() => {
    const detected = detectLanguage()
    const saved = localStorage.getItem('extron-lang') as Lang | null
    const next = saved || detected
    setLangState(next)
    document.documentElement.lang = next
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('extron-lang', l)
    document.documentElement.lang = l
  }

  const t = getTranslations(lang)

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
