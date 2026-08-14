import type { MetadataRoute } from 'next'
import { listPosts } from '@/lib/content/posts'

const BASE = 'https://extro.com.co'

/**
 * M-4: el sitemap anterior estaba escrito a mano y solo listaba '/' y '/blog'.
 * Los nueve artículos —que son toda la apuesta de long-tail— y /terms no
 * estaban. Ahora sale de las mismas fuentes que renderizan las páginas, así que
 * no puede volver a desincronizarse.
 *
 * M-3: cada URL declara su alternativa en inglés con hreflang.
 */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts()

  const alt = (path: string) => ({
    languages: {
      es: `${BASE}${path}`,
      en: `${BASE}/en${path}`,
    },
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1, alternates: alt('') },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: alt('/blog') },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3, alternates: alt('/terms') },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(`${p.date}T12:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.6,
    alternates: alt(`/blog/${p.slug}`),
  }))

  return [...staticRoutes, ...postRoutes]
}
