import type { MetadataRoute } from 'next'
import { absoluteUrl, type Locale } from '@/lib/i18n/config'
import type { PostMeta } from '@/lib/content/posts'

/**
 * Last real change of the static pages (home, terms). Bump it by hand when
 * their content changes; never use `new Date()`, which would make lastmod
 * change on every request and lose credibility with crawlers.
 */
export const STATIC_LASTMOD = new Date('2026-11-16T12:00:00Z')

type Entry = MetadataRoute.Sitemap[number]

const postDate = (p: { date: string }) => new Date(`${p.date}T12:00:00Z`)

function pair(path: string, lastModified: Date, changeFrequency: Entry['changeFrequency'], priority: number): Entry[] {
  const languages = {
    es: absoluteUrl(path, 'es'),
    en: absoluteUrl(path, 'en'),
    'x-default': absoluteUrl(path, 'es'),
  }
  return (['es', 'en'] as Locale[]).map((l) => ({
    url: absoluteUrl(path, l),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }))
}

/**
 * `esPosts` / `enPosts` come from listPosts('es') / listPosts('en'). Each post
 * carries `slugs` so the ES and EN entries can reference each other.
 */
export function buildSitemap(esPosts: PostMeta[], enPosts: PostMeta[]): MetadataRoute.Sitemap {
  const all = [...esPosts, ...enPosts]
  const blogLastMod = all.length ? new Date(Math.max(...all.map((p) => postDate(p).getTime()))) : STATIC_LASTMOD

  const entries: MetadataRoute.Sitemap = [
    ...pair('/', STATIC_LASTMOD, 'weekly', 1),
    ...pair('/blog', blogLastMod, 'weekly', 0.8),
    ...pair('/terms', STATIC_LASTMOD, 'yearly', 0.3),
  ]

  const postEntry = (p: PostMeta, lang: Locale): Entry => {
    const both = p.slugs.es && p.slugs.en
    return {
      url: absoluteUrl(`/blog/${p.slug}`, lang),
      lastModified: postDate(p),
      changeFrequency: 'monthly',
      priority: 0.6,
      ...(both
        ? {
            alternates: {
              languages: {
                es: absoluteUrl(`/blog/${p.slugs.es}`, 'es'),
                en: absoluteUrl(`/blog/${p.slugs.en}`, 'en'),
                'x-default': absoluteUrl(`/blog/${p.slugs.es}`, 'es'),
              },
            },
          }
        : {}),
    }
  }

  return [...entries, ...esPosts.map((p) => postEntry(p, 'es')), ...enPosts.map((p) => postEntry(p, 'en'))]
}
