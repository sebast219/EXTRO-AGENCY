import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { PortableText } from 'next-sanity'
import { fallbackPosts, type FallbackPost } from '@/lib/blog-posts'
import {
  isSanityConfigured,
  getSanityClient,
  POSTS_QUERY,
  POST_QUERY,
  formatDate,
  type SanityPost,
  type SanityPostMeta,
} from '@/lib/sanity'

export const revalidate = 60

type Post = FallbackPost | SanityPost

export async function generateStaticParams() {
  if (!isSanityConfigured) {
    return fallbackPosts.map((p) => ({ slug: p.slug }))
  }
  const posts = await getSanityClient().fetch<SanityPostMeta[]>(POSTS_QUERY)
  return posts.map((p) => ({ slug: p.slug.current }))
}

async function getPost(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) {
    return fallbackPosts.find((p) => p.slug === slug) ?? null
  }
  const post = await getSanityClient().fetch<SanityPost | null>(POST_QUERY, { slug })
  return post
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} · EX·TRON`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Volver al blog
        </Link>

        <div className="flex items-center gap-3 mb-4">
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

        <h1 className="text-3xl md:text-4xl font-medium text-primary leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-secondary leading-relaxed mb-10">{post.excerpt}</p>

        <div className="border-t border-border pt-10">
          {!isSanityConfigured ? (
            (post as FallbackPost).content.map((paragraph, i) => (
              <p key={i} className="text-base text-secondary leading-relaxed mb-5">
                {paragraph}
              </p>
            ))
          ) : (
            <PortableText
              value={(post as SanityPost).content}
              components={{
                block: {
                  h2: ({ children }: { children?: React.ReactNode }) => (
                    <h2 className="text-2xl font-medium text-primary mt-10 mb-4">{children}</h2>
                  ),
                  h3: ({ children }: { children?: React.ReactNode }) => (
                    <h3 className="text-xl font-medium text-primary mt-8 mb-3">{children}</h3>
                  ),
                  p: ({ children }: { children?: React.ReactNode }) => (
                    <p className="text-base text-secondary leading-relaxed mb-5">{children}</p>
                  ),
                  blockquote: ({ children }: { children?: React.ReactNode }) => (
                    <blockquote className="border-l-2 border-primary pl-4 my-6 text-primary italic">
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({ children }: { children?: React.ReactNode }) => (
                    <ul className="list-disc pl-6 my-5 space-y-2 text-base text-secondary">{children}</ul>
                  ),
                  number: ({ children }: { children?: React.ReactNode }) => (
                    <ol className="list-decimal pl-6 my-5 space-y-2 text-base text-secondary">{children}</ol>
                  ),
                },
                marks: {
                  link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => (
                    <a
                      href={value?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}
