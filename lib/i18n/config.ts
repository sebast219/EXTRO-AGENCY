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

/**
 * Idiomas soportados a partir del header `Accept-Language` del dispositivo.
 *
 * Se respeta el orden de preferencia (`q=`), no solo el primer valor: un
 * navegador puede enviar `fr-FR,en;q=0.9` y el usuario espera inglés, no el
 * idioma por defecto. Si ninguno de los idiomas del dispositivo está soportado
 * se cae al idioma por defecto del sitio.
 */
export function detectLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE

  const entries = acceptLanguage
    .split(',')
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? Number.parseFloat(qParam.split('=')[1]) : 1
      return { tag: rawTag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 }
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of entries) {
    if (tag === 'en' || tag.startsWith('en-')) return 'en'
    if (tag === 'es' || tag.startsWith('es-')) return 'es'
  }

  return DEFAULT_LOCALE
}

/**
 * Los rastreadores no deben recibir una redirección por idioma: su
 * `Accept-Language` no representa a una persona y redirigir rompería la
 * equivalencia de las URLs con hreflang.
 */
const CRAWLER_RE =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|embedly|pinterest|whatsapp|telegrambot|google-inspectiontool|adsbot|mediapartners|headlesschrome|python-requests|curl\/|wget\//i

export function isCrawler(userAgent: string | null | undefined): boolean {
  return Boolean(userAgent && CRAWLER_RE.test(userAgent))
}
