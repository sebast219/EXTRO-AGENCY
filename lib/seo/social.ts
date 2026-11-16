import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/config'

/** Default Open Graph image per language (1200x630): ES -> /og.png, EN -> /og-en.png. */
export function ogImageFor(lang: Locale) {
  return { url: lang === 'en' ? '/og-en.png' : '/og.png', width: 1200, height: 630 }
}

const OG_LOCALE: Record<Locale, string> = { es: 'es_CO', en: 'en_US' }

/**
 * Per-page Open Graph + Twitter blocks. Next does not deep-merge `openGraph`
 * with the layout one, so every page that defines its own must restate url,
 * locale, siteName and image.
 */
export function socialMeta(opts: {
  title: string
  description: string
  url: string
  lang: Locale
  type?: 'website' | 'article'
  image?: string
  publishedTime?: string
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const image = opts.image
    ? { url: opts.image, alt: opts.title }
    : { ...ogImageFor(opts.lang), alt: opts.title }
  const other: Locale = opts.lang === 'es' ? 'en' : 'es'
  return {
    openGraph: {
      type: opts.type ?? 'website',
      title: opts.title,
      description: opts.description,
      url: opts.url,
      siteName: 'EXTRO',
      locale: OG_LOCALE[opts.lang],
      alternateLocale: [OG_LOCALE[other]],
      images: [image],
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [image.url],
    },
  }
}
