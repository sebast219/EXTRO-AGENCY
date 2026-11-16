import type { MetadataRoute } from 'next'
import { listPosts } from '@/lib/content/posts'
import { buildSitemap } from '@/lib/seo/sitemap'

/**
 * Built from the same sources that render the pages (see lib/seo/sitemap.ts).
 * Every language version has its own <url> with reciprocal hreflang alternates
 * and a real lastmod (post date / static-page constant).
 */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [es, en] = await Promise.all([listPosts('es'), listPosts('en')])
  return buildSitemap(es, en)
}
