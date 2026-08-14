import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { listPosts, formatPostDate } from '@/lib/content/posts'
import { alternatesFor, isLocale, localizedPath, type Locale } from '@/lib/i18n/config'

export const revalidate = 60

const COPY: Record<Locale, { title: string; description: string; intro: string; back: string }> = {
  es: {
    title: 'Blog · EXTRO',
    description: 'Artículos sobre desarrollo de software, automatización y arquitectura.',
    intro:
      'Artículos sobre desarrollo de software, automatización, arquitectura y lecciones aprendidas construyendo productos digitales.',
    back: 'Volver al inicio',
  },
  en: {
    title: 'Blog · EXTRO',
    description: 'Articles on software development, automation, and architecture.',
    intro:
      'Articles on software development, automation, architecture, and lessons learned building digital products.',
    back: 'Back to home',
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
  const copy = COPY[lang]
  const posts = await listPosts()

  return (
    <main id="main-content" className="min-h-screen bg-white" tabIndex={-1}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href={localizedPath('/', lang)}
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {copy.back}
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-medium text-primary mb-4">Blog</h1>
          <p className="text-secondary max-w-xl">{copy.intro}</p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={localizedPath(`/blog/${post.slug}`, lang)}
              className="group p-6 border border-border rounded-xl hover:border-primary hover:bg-surface-raised transition-all block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-[11px] px-2.5 py-1 border border-border rounded-full text-secondary">
                  {post.tag}
                </span>
                <span className="flex items-center gap-1 text-xs text-secondary">
                  <Calendar size={12} aria-hidden="true" />
                  <time dateTime={post.date}>{formatPostDate(post.date, lang)}</time>
                </span>
                <span className="flex items-center gap-1 text-xs text-secondary">
                  <Clock size={12} aria-hidden="true" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-medium text-primary mb-2 group-hover:translate-x-1 transition-transform motion-reduce:transform-none">
                {post.title}
              </h2>
              <p className="text-sm text-secondary leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
