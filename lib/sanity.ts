import { createClient } from 'next-sanity'
import type { PortableTextBlock } from 'sanity'
import type { BlogPostMeta } from './blog-posts'

export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET
)

export function getSanityClient() {
  if (!isSanityConfigured) {
    throw new Error('Sanity no está configurado. Define NEXT_PUBLIC_SANITY_PROJECT_ID y NEXT_PUBLIC_SANITY_DATASET.')
  }
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-06-01',
    useCdn: true,
  })
}

export const POSTS_QUERY = `*[_type == "post"] | order(date desc) {
  _id, title, slug, excerpt, tag, date, readTime
}`

export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id, title, slug, excerpt, tag, date, readTime, content
}`

export interface SanityPostMeta extends Omit<BlogPostMeta, 'slug'> {
  _id: string
  slug: { current: string }
}

export interface SanityPost extends SanityPostMeta {
  content: PortableTextBlock[]
}

export function toBlogPostMeta(post: SanityPostMeta): BlogPostMeta {
  return {
    slug: post.slug.current,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    readTime: post.readTime,
    tag: post.tag,
  }
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
