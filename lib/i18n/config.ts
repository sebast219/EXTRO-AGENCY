/**
 * M-3: configuración de idiomas y rutas.
 *
 * El español no lleva prefijo y el inglés vive bajo /en. Esta asimetría es
 * deliberada: las URLs en español ya están indexadas y moverlas a /es habría
 * tirado a la basura el posicionamiento acumulado.
 *
 * Internamente todas las rutas viven bajo app/(site)/[lang]/; la middleware
 * reescribe las peticiones sin prefijo a /es sin cambiar la barra de direcciones.
 */

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es'

export const SITE_URL = 'https://extro.com.co'

export function isLocale(value: string | undefined): value is Locale {
  return value === 'es' || value === 'en'
}

/** URL pública de una ruta en un idioma. `/blog` + en -> `/en/blog` */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '')
  return locale === DEFAULT_LOCALE ? clean || '/' : `/en${clean}`
}

export function absoluteUrl(path: string, locale: Locale): string {
  const localized = localizedPath(path, locale)
  return `${SITE_URL}${localized === '/' ? '' : localized}`
}

/**
 * Bloque `alternates` para la metadata de Next: canónica del idioma actual más
 * hreflang de cada alternativa y x-default apuntando al español.
 */
export function alternatesFor(path: string, locale: Locale) {
  return {
    canonical: absoluteUrl(path, locale),
    languages: {
      es: absoluteUrl(path, 'es'),
      en: absoluteUrl(path, 'en'),
      'x-default': absoluteUrl(path, 'es'),
    },
  }
}

/** Quita el prefijo de idioma de una ruta pública. `/en/blog` -> `/blog` */
export function stripLocale(pathname: string): string {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}
