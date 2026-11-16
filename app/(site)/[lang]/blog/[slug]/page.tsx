import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { PortableText } from 'next-sanity'
import SiteChrome from '@/components/home/SiteChrome'
import { getPost, listPosts, formatPostDate } from '@/lib/content/posts'
import { isLocale, localizedPath, absoluteUrl, LOCALES } from '@/lib/i18n/config'
import { safeJsonLd } from '@/lib/seo/json-ld'
import { blogAlternates } from '@/lib/content/blog-i18n'
import { blogPostingSchema } from '@/lib/seo/schema'
import { socialMeta } from '@/lib/seo/social'

/**
 * CSP nonce (proxy.ts): el nonce solo se estampa en <script> cuando la página
 * se renderiza por request. Ver el comentario equivalente en layout.tsx.
 * `revalidate = 60` (ISR) se quitó de aquí porque no aplica con `dynamic =
 * 'force-dynamic'` — la caché de datos ahora vive en `lib/content/posts.ts`
 * vía `unstable_cache` con el mismo TTL de 60s, que es donde realmente se
 * necesitaba (el fetch a Sanity, no el HTML).
 */
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const perLang = await Promise.all(
    LOCALES.map(async (lang) => (await listPosts(lang)).map((p) => ({ lang, slug: p.slug })))
  )
  return perLang.flat()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLocale(lang)) return {}
  const post = await getPost(slug, lang)
  if (!post) return {}

  // Each language version is indexable, canonical to itself, with reciprocal
  // hreflang when both versions exist. Posts without an English version never
  // reach /en (the proxy answers 301 to the Spanish URL).
  return {
    title: `${post.title} · EXTRO`,
    description: post.excerpt,
    alternates: blogAlternates(post.slugs, lang),
    ...socialMeta({
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`, lang),
      lang,
      type: 'article',
      publishedTime: post.date,
      // No per-post cover image in the data model yet: default OG image.
    }),
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()

  const post = await getPost(slug, lang)
  if (!post) notFound()

  const articleSchema = blogPostingSchema(post, lang)

  return (
    <SiteChrome lang={lang}>
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '150px 24px 120px' }}>
        <Link
          href={localizedPath('/blog', lang)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, color: '#a1a1aa', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {lang === 'es' ? 'Volver al blog' : 'Back to blog'}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap', fontSize: 13, color: '#a1a1aa' }}>
          <span style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 12, color: '#7fb2ff' }}>{post.tag}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} aria-hidden="true" />
            <time dateTime={post.date}>{formatPostDate(post.date, lang)}</time>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} aria-hidden="true" />
            {post.readTime}
          </span>
        </div>

        <h1
          className="grad"
          style={{ margin: '0 0 16px', fontFamily: 'var(--font-space),sans-serif', fontWeight: 500, fontSize: 'clamp(34px, 4.6vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.04em', textWrap: 'balance' }}
        >
          {post.title}
        </h1>
        <p style={{ margin: '0 0 40px', fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>{post.excerpt}</p>

        <div className="lg-doc" style={{ borderTop: '1px solid #27272a', paddingTop: 40, maxWidth: 'none' }}>
          {post.source === 'local' ? (
            post.body.map((paragraph, i) => (
              <p key={i} className="lg-p" style={{ fontSize: 17 }}>
                {paragraph}
              </p>
            ))
          ) : (
            <PortableText
              value={post.body}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 className="lg-h3" style={{ fontSize: 26 }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => <h3 className="lg-h3">{children}</h3>,
                  normal: ({ children }) => (
                    <p className="lg-p" style={{ fontSize: 17 }}>
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeft: '2px solid #0066ff', paddingLeft: 16, margin: '24px 0', color: '#e4e4e7', fontStyle: 'italic' }}>
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({ children }) => <ul className="lg-ul">{children}</ul>,
                  number: ({ children }) => <ol className="lg-ul">{children}</ol>,
                },
                marks: {
                  link: ({ children, value }) => (
                    <a href={value?.href} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                },
              }}
            />
          )}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
        />
      </article>
    </SiteChrome>
  )
}
