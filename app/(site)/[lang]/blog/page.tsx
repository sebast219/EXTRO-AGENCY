import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteChrome from '@/components/home/SiteChrome'
import BlogIndex from '@/components/blog/BlogIndex'
import { listPosts, formatPostDate } from '@/lib/content/posts'
import { alternatesFor, isLocale, localizedPath, type Locale } from '@/lib/i18n/config'

/**
 * CSP nonce (proxy.ts): el nonce solo se estampa en <script> cuando la página
 * se renderiza por request. Ver el comentario equivalente en layout.tsx.
 * `revalidate = 60` (ISR) se quitó de aquí porque no aplica con `dynamic =
 * 'force-dynamic'` — la caché de datos ahora vive en `lib/content/posts.ts`
 * vía `unstable_cache` con el mismo TTL de 60s, que es donde realmente se
 * necesitaba (el fetch a Sanity, no el HTML).
 */
export const dynamic = 'force-dynamic'

const COPY: Record<Locale, { title: string; description: string }> = {
  es: {
    title: 'Blog · EXTRO',
    description: 'Artículos sobre desarrollo de software, automatización y arquitectura.',
  },
  en: {
    title: 'Blog · EXTRO',
    description: 'Articles on software development, automation, and architecture.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const copy = COPY[lang]
  return {
    title: copy.title,
    description: copy.description,
    alternates: alternatesFor('/blog', lang),
  }
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const posts = await listPosts()

  return (
    <SiteChrome lang={lang}>
      <BlogIndex
        posts={posts.map((p) => ({
          slug: p.slug,
          href: localizedPath(`/blog/${p.slug}`, lang),
          title: p.title,
          tag: p.tag,
          date: formatPostDate(p.date, lang),
          excerpt: p.excerpt,
          readTime: p.readTime,
        }))}
      />
    </SiteChrome>
  )
}
