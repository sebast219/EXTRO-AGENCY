import { describe, it, expect } from 'vitest'
import { fallbackPosts } from '@/lib/blog-posts'
import { blogAlternates, enBlogRedirect, enSlugFor } from '@/lib/content/blog-i18n'
import type { PostMeta } from '@/lib/content/posts'
import { buildSitemap, STATIC_LASTMOD } from './sitemap'
import { BLOG_SLUGS } from '@/lib/blog-slugs'
import { ogImageFor, socialMeta } from './social'
import { organizationSchema, websiteSchema, faqSchema, blogPostingSchema, ORGANIZATION_ID } from './schema'

const meta = (p: (typeof fallbackPosts)[number], lang: 'es' | 'en'): PostMeta => ({
  slug: lang === 'en' ? p.en!.slug : p.slug,
  title: p.title,
  excerpt: p.excerpt,
  date: p.date,
  readTime: p.readTime,
  tag: p.tag,
  slugs: { es: p.slug, en: p.en?.slug },
})

describe('blog hreflang / canonical', () => {
  const slugs = { es: 'mvp-7-dias', en: 'ship-a-working-mvp-in-7-days' }

  it('EN canonical points to itself, never to the ES URL', () => {
    const a = blogAlternates(slugs, 'en')
    expect(a.canonical).toBe('https://extro.com.co/en/blog/ship-a-working-mvp-in-7-days')
  })

  it('emits reciprocal es/en/x-default', () => {
    for (const lang of ['es', 'en'] as const) {
      const a = blogAlternates(slugs, lang) as { languages: Record<string, string> }
      expect(a.languages.es).toBe('https://extro.com.co/blog/mvp-7-dias')
      expect(a.languages.en).toBe('https://extro.com.co/en/blog/ship-a-working-mvp-in-7-days')
      expect(a.languages['x-default']).toBe(a.languages.es)
    }
  })

  it('a Spanish-only post has no alternates', () => {
    expect(blogAlternates({ es: 'solo-es' }, 'es')).toEqual({ canonical: 'https://extro.com.co/blog/solo-es' })
  })
})

describe('/en/blog redirects', () => {
  it('every Spanish post has an English version with a distinct, real slug', () => {
    for (const p of fallbackPosts) {
      expect(p.en, p.slug).toBeDefined()
      expect(p.en!.content.length).toBe(p.content.length)
    }
  })

  it('serves real English slugs as is', () => {
    expect(enBlogRedirect('ship-a-working-mvp-in-7-days')).toBeNull()
  })

  it('redirects a legacy Spanish slug under /en to the English URL', () => {
    expect(enBlogRedirect('precio-cerrado-vs-horas')).toBe('/en/blog/fixed-price-vs-hourly-billing')
    expect(enSlugFor('precio-cerrado-vs-horas')).toBe('fixed-price-vs-hourly-billing')
  })

  it('leaves unknown slugs to a plain 404', () => {
    expect(enBlogRedirect('does-not-exist')).toBeNull()
  })
})

describe('sitemap', () => {
  const es = fallbackPosts.map((p) => meta(p, 'es'))
  const en = fallbackPosts.map((p) => meta(p, 'en'))
  const map = buildSitemap(es, en)

  it('has its own entry for every EN URL with hreflang alternates', () => {
    const enHome = map.find((e) => e.url === 'https://extro.com.co/en')
    expect(enHome?.alternates?.languages).toMatchObject({
      es: 'https://extro.com.co',
      en: 'https://extro.com.co/en',
      'x-default': 'https://extro.com.co',
    })
    const enPost = map.find((e) => e.url === 'https://extro.com.co/en/blog/ship-a-working-mvp-in-7-days')
    expect(enPost?.alternates?.languages).toMatchObject({ es: 'https://extro.com.co/blog/mvp-7-dias' })
  })

  it('uses real, stable lastmod values', () => {
    const home = map.find((e) => e.url === 'https://extro.com.co')!
    expect(home.lastModified).toEqual(STATIC_LASTMOD)
    const post = map.find((e) => e.url === 'https://extro.com.co/blog/mvp-7-dias')!
    expect(post.lastModified).toEqual(new Date('2026-06-10T12:00:00Z'))
    const blog = map.find((e) => e.url === 'https://extro.com.co/blog')!
    expect(blog.lastModified).toEqual(new Date('2026-08-01T12:00:00Z'))
  })
})

describe('organization schema', () => {
  const org = organizationSchema('es')
  it('is a plain Organization with a stable id and no local-business fields', () => {
    expect(org['@type']).toBe('Organization')
    expect(org['@id']).toBe(ORGANIZATION_ID)
    expect(org).not.toHaveProperty('geo')
    expect(org).not.toHaveProperty('openingHoursSpecification')
    expect(org.areaServed).toBe('Worldwide')
    expect(org.founder['@type']).toBe('Person')
  })
  it('keeps the brand name and drops removed promises', () => {
    const txt = JSON.stringify([organizationSchema('es'), organizationSchema('en')])
    expect(txt).not.toMatch(/garant|guarantee|semanal|weekly|[Aa]gencia|studio/)
  })
})

describe('JSON-LD', () => {
  const post = { slug: 'ship-a-working-mvp-in-7-days', title: 'T', excerpt: 'E', date: '2026-06-10' }

  it('BlogPosting declares the right language, url and no copied dateModified', () => {
    const s = blogPostingSchema(post, 'en')
    expect(s['@type']).toBe('BlogPosting')
    expect(s.inLanguage).toBe('en')
    expect(s.url).toBe('https://extro.com.co/en/blog/ship-a-working-mvp-in-7-days')
    expect(s.mainEntityOfPage['@id']).toBe(s.url)
    expect(s.publisher['@id']).toBe(ORGANIZATION_ID)
    expect(s).not.toHaveProperty('dateModified')
    expect(blogPostingSchema({ ...post, slug: 'mvp-7-dias' }, 'es').inLanguage).toBe('es')
  })

  it('WebSite carries inLanguage and links to the Organization', () => {
    const w = websiteSchema('en')
    expect(w.inLanguage).toBe('en')
    expect(w.publisher['@id']).toBe(ORGANIZATION_ID)
  })

  it('Organization has no inLanguage and no personal sameAs (only on founder)', () => {
    const o = organizationSchema('es')
    expect(o).not.toHaveProperty('inLanguage')
    expect(o).not.toHaveProperty('sameAs')
    expect(o.founder.sameAs.length).toBeGreaterThan(0)
  })

  it('FAQPage is built per language and includes the agency question', () => {
    const es = faqSchema('es')
    const en = faqSchema('en')
    expect(es['@type']).toBe('FAQPage')
    expect(es.inLanguage).toBe('es')
    expect(en.inLanguage).toBe('en')
    expect(JSON.stringify(es)).toContain('agencia de software')
    expect(JSON.stringify(en)).toContain('software agency')
    expect(es.mainEntity.length).toBe(en.mainEntity.length)
  })
})

describe('sitemap reciprocity', () => {
  const es = fallbackPosts.map((p) => meta(p, 'es'))
  const en = fallbackPosts.map((p) => meta(p, 'en'))
  const map = buildSitemap(es, en)
  const urls = new Set(map.map((e) => e.url))

  it('every alternate is its own <url>, and each entry lists itself', () => {
    for (const e of map) {
      const langs = Object.values(e.alternates?.languages ?? {}) as string[]
      for (const alt of langs) expect(urls.has(alt), `${e.url} -> ${alt}`).toBe(true)
      if (langs.length) expect(langs).toContain(e.url)
    }
  })

  it('alternates are reciprocal', () => {
    for (const e of map) {
      const langs = Object.values(e.alternates?.languages ?? {}) as string[]
      for (const alt of langs) {
        const other = map.find((m) => m.url === alt)!
        const back = Object.values(other.alternates?.languages ?? {}) as string[]
        expect(back, `${alt} -> ${e.url}`).toContain(e.url)
      }
    }
  })
})

describe('slug map and og images', () => {
  it('blog slugs have no duplicates and every post has its entry', () => {
    const entries = Object.values(BLOG_SLUGS) as { es: string; en?: string }[]
    const all = entries.flatMap((e) => [e.es, e.en].filter(Boolean) as string[])
    // ES vs ES, EN vs EN and ES vs EN of another post. The one allowed repeat is
    // a post whose EN slug equals its own ES slug (nextjs-vs-astro).
    const dupes = entries.flatMap((e) => (e.en === e.es ? [e.es] : [e.es, e.en].filter(Boolean) as string[]))
    expect(new Set(dupes).size).toBe(dupes.length)
    expect(all.length).toBeGreaterThan(0)
    expect(fallbackPosts.length).toBe(entries.length)
    const slugSet = new Set(entries.map((e) => e.es))
    for (const p of fallbackPosts) {
      expect(slugSet.has(p.slug), p.slug).toBe(true)
      const entry = entries.find((e) => e.es === p.slug)!
      expect(p.en?.slug).toBe(entry.en)
    }
  })

  it('og:image and twitter:image are per language', () => {
    expect(ogImageFor('es').url).toBe('/og.png')
    expect(ogImageFor('en').url).toBe('/og-en.png')
    for (const [lang, url] of [['es', '/og.png'], ['en', '/og-en.png']] as const) {
      const m = socialMeta({ title: 't', description: 'd', url: 'https://extro.com.co', lang })
      expect((m.openGraph!.images as { url: string }[])[0].url).toBe(url)
      expect(m.twitter!.images).toEqual([url])
    }
    expect(blogPostingSchema({ slug: 'a', title: 't', excerpt: 'e', date: '2026-01-01' }, 'en').image).toBe('https://extro.com.co/og-en.png')
  })

  it('the cost post carries no USD price ranges', () => {
    const p = fallbackPosts.find((x) => x.slug === 'cuanto-cuesta-desarrollar-app-colombia')!
    expect(JSON.stringify(p)).not.toMatch(/USD|\d\.\d{3}/)
  })
})
