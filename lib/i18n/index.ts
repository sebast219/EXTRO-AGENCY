import { es } from './es'
import { en } from './en'

export type Lang = 'es' | 'en'
export type Translations = typeof es

const translations: Record<Lang, Translations> = { es, en }

export function getTranslations(lang: Lang): Translations {
  return translations[lang] || translations.es
}

export function detectLanguage(): Lang {
  if (typeof window === 'undefined') return 'es'
  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('en') ? 'en' : 'es'
}
