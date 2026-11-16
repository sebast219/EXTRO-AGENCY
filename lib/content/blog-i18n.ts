import { BLOG_SLUGS, type BlogSlugEntry } from '@/lib/blog-slugs'

const ENTRIES: ReadonlyArray<BlogSlugEntry> = Object.values(BLOG_SLUGS)
import { absoluteUrl, type Locale } from '@/lib/i18n/config'

/** Slug of each language version of a post. A missing key means no such version. */
export type PostSlugs = { es?: string; en?: string }

export function enSlugFor(esSlug: string): string | undefined {
  return ENTRIES.find((p) => p.es === esSlug)?.en
}

export function esSlugForEn(enSlug: string): string | undefined {
  return ENTRIES.find((p) => p.en === enSlug)?.es
}

/**
 * Canonical (always self) plus reciprocal hreflang. Languages are only emitted
 * when both versions exist: a post without translation never gets an
 * alternate and never combines noindex with a foreign canonical.
 */
export function blogAlternates(slugs: PostSlugs, lang: Locale) {
  const own = slugs[lang]
  // Defensive: never build `/blog/undefined`. Without a slug for this locale
  // there is no page to point at, so no canonical either.
  if (!own) return {}
  const canonical = absoluteUrl(`/blog/${own}`, lang)
  if (!slugs.es || !slugs.en) return { canonical }
  return {
    canonical,
    languages: {
      es: absoluteUrl(`/blog/${slugs.es}`, 'es'),
      en: absoluteUrl(`/blog/${slugs.en}`, 'en'),
      'x-default': absoluteUrl(`/blog/${slugs.es}`, 'es'),
    },
  }
}

/**
 * Mirror rule for the language switcher (EN -> ES only swaps the prefix, so
 * `/blog/<english-slug>` reaches the server). Returns the Spanish path when
 * the slug is the English slug of a post, null otherwise.
 */
export function esBlogRedirect(slug: string): string | null {
  const es = esSlugForEn(slug)
  return es && es !== slug ? `/blog/${es}` : null
}

/**
 * Destination (path) for a request to /en/blog/<slug> that must be redirected
 * with a 301, or null when it is served as is (real English post, or an
 * unknown slug that ends in a plain 404).
 *  - Spanish slug with an English version -> that English URL
 *  - Spanish-only post -> the Spanish URL
 */
export function enBlogRedirect(slug: string): string | null {
  if (esSlugForEn(slug)) return null
  const post = ENTRIES.find((p) => p.es === slug)
  if (!post) return null
  return post.en ? `/en/blog/${post.en}` : `/blog/${slug}`
}
