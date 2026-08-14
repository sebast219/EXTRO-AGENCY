import { createClient } from 'next-sanity'
import type { PortableTextBlock } from 'sanity'
import { fallbackPosts, type FallbackPost } from '@/lib/blog-posts'
import { log, captureException } from '@/lib/observability/logger'

/**
 * M-8: una sola puerta de entrada al contenido del blog, con degradación real.
 *
 * Antes las páginas llamaban a `getSanityClient().fetch(...)` sin try/catch: una
 * caída de Sanity rompía el build en `generateStaticParams` y devolvía 500 en la
 * página. Ahora cualquier fallo se registra y se cae al contenido local, que ya
 * existía pero solo se usaba cuando Sanity no estaba configurado.
 */

export type PostMeta = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tag: string
}

export type Post =
  | (PostMeta & { source: 'local'; body: string[] })
  | (PostMeta & { source: 'sanity'; body: PortableTextBlock[] })

const POSTS_QUERY = `*[_type == "post"] | order(date desc) {
  _id, title, slug, excerpt, tag, date, readTime
}`

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id, title, slug, excerpt, tag, date, readTime, content
}`

type SanityMeta = Omit<PostMeta, 'slug'> & { slug: { current: string } }
type SanityFull = SanityMeta & { content: PortableTextBlock[] }

export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET
)

let client: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!isSanityConfigured) return null
  if (!client) {
    client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-06-01',
      useCdn: true,
      perspective: 'published',
    })
  }
  return client
}

/**
 * B-9: el tiempo de lectura del contenido local venía escrito a mano. Aquí se
 * calcula cuando falta, a 200 palabras por minuto.
 */
function readTimeOf(paragraphs: string[], fallback?: string): string {
  if (fallback) return fallback
  const words = paragraphs.join(' ').trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min`
}

function localMeta(p: FallbackPost): PostMeta {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    tag: p.tag,
    readTime: readTimeOf(p.content, p.readTime),
  }
}

export async function listPosts(): Promise<PostMeta[]> {
  const sanity = getClient()
  if (!sanity) return fallbackPosts.map(localMeta)

  try {
    const rows = await sanity.fetch<SanityMeta[]>(POSTS_QUERY)
    if (!rows?.length) {
      log.warn('content.sanity_empty', { effect: 'se usa el contenido local' })
      return fallbackPosts.map(localMeta)
    }
    return rows.map((r) => ({ ...r, slug: r.slug.current }))
  } catch (err) {
    await captureException(err, { event: 'content.list_failed' })
    return fallbackPosts.map(localMeta)
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  const sanity = getClient()

  if (sanity) {
    try {
      const row = await sanity.fetch<SanityFull | null>(POST_QUERY, { slug })
      if (row) {
        return {
          slug: row.slug.current,
          title: row.title,
          excerpt: row.excerpt,
          date: row.date,
          tag: row.tag,
          readTime: row.readTime,
          source: 'sanity',
          body: row.content,
        }
      }
      // Sin resultado en Sanity: puede ser un artículo que solo existe en local.
    } catch (err) {
      await captureException(err, { event: 'content.get_failed', slug })
    }
  }

  const local = fallbackPosts.find((p) => p.slug === slug)
  if (!local) return null
  return { ...localMeta(local), source: 'local', body: local.content }
}

/**
 * M-9: antes `new Date(iso + 'T00:00:00')` se interpretaba en la zona del
 * proceso. En Vercel (UTC) frente a un equipo en Bogotá eso desplazaba la fecha
 * un día. Se ancla a mediodía UTC y se formatea con zona explícita.
 */
export function formatPostDate(iso: string, locale: 'es' | 'en' = 'es'): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CO' : 'en-US', {
    timeZone: 'America/Bogota',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${iso}T12:00:00Z`))
}
