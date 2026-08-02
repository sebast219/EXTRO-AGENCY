import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { fallbackPosts } from '@/lib/blog-posts'
import {
  isSanityConfigured,
  getSanityClient,
  POSTS_QUERY,
  toBlogPostMeta,
  formatDate,
  type SanityPostMeta,
} from '@/lib/sanity'
import type { BlogPostMeta } from '@/lib/blog-posts'

export const metadata = {
  title: 'Blog · EX·TRON',
  description: 'Artículos sobre desarrollo de software, automatización y tecnología.',
}

export const revalidate = 60

async function getPosts(): Promise<BlogPostMeta[]> {
  if (!isSanityConfigured) {
    return fallbackPosts
  }
  const posts = await getSanityClient().fetch<SanityPostMeta[]>(POSTS_QUERY)
  return posts.map(toBlogPostMeta)
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-medium text-primary mb-4">Blog</h1>
          <p className="text-secondary max-w-xl">
            Artículos sobre desarrollo de software, automatización, arquitectura y lecciones aprendidas construyendo productos digitales.
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-6 border border-border rounded-xl hover:border-primary hover:bg-surface-raised transition-all cursor-pointer block"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] px-2.5 py-1 border border-border rounded-full text-tertiary">
                  {post.tag}
                </span>
                <span className="flex items-center gap-1 text-xs text-tertiary">
                  <Calendar size={12} />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1 text-xs text-tertiary">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-medium text-primary mb-2 group-hover:translate-x-1 transition-transform">
                {post.title}
              </h2>
              <p className="text-sm text-secondary leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
