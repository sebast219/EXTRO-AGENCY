import { es } from './es'
import { en } from './en'
import { DEFAULT_LOCALE, type Locale } from './config'

export type Lang = Locale
export type Translations = typeof es

const translations: Record<Locale, Translations> = { es, en }

export function getTranslations(lang: Locale): Translations {
  return translations[lang] ?? translations[DEFAULT_LOCALE]
}

export { LOCALES, DEFAULT_LOCALE, isLocale, localizedPath, alternatesFor, stripLocale, absoluteUrl, SITE_URL } from './config'
export type { Locale } from './config'
