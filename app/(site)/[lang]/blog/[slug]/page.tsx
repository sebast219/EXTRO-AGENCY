import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { PortableText } from 'next-sanity'
import { getPost, listPosts, formatPostDate } from '@/lib/content/posts'
import { alternatesFor, isLocale, localizedPath, absoluteUrl, SITE_URL, LOCALES } from '@/lib/i18n/config'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await listPosts()
  return LOCALES.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLocale(lang)) return {}
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: `${post.title} · EXTRO`,
    description: post.excerpt,
    alternates: alternatesFor(`/blog/${post.slug}`, lang),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      url: absoluteUrl(`/blog/${post.slug}`, lang),
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()

  const post = await getPost(slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: lang,
    url: absoluteUrl(`/blog/${post.slug}`, lang),
    author: { '@type': 'Organization', name: 'EXTRO', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'EXTRO',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`, lang),
  }

  return (
    <main id="main-content" className="min-h-screen bg-white" tabIndex={-1}>
      <article className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href={localizedPath('/blog', lang)}
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {lang === 'es' ? 'Volver al blog' : 'Back to blog'}
        </Link>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
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

        <h1 className="text-3xl md:text-4xl font-medium text-primary leading-tight mb-4 text-balance">
          {post.title}
        </h1>
        <p className="text-lg text-secondary leading-relaxed mb-10">{post.excerpt}</p>

        <div className="border-t border-border pt-10">
          {post.source === 'local' ? (
            post.body.map((paragraph, i) => (
              <p key={i} className="text-base text-secondary leading-relaxed mb-5">
                {paragraph}
              </p>
            ))
          ) : (
            <PortableText
              value={post.body}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-medium text-primary mt-10 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium text-primary mt-8 mb-3">{children}</h3>
                  ),
                  normal: ({ children }) => (
                    <p className="text-base text-secondary leading-relaxed mb-5">{children}</p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-primary pl-4 my-6 text-primary italic">
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="list-disc pl-6 my-5 space-y-2 text-base text-secondary">{children}</ul>
                  ),
                  number: ({ children }) => (
                    <ol className="list-decimal pl-6 my-5 space-y-2 text-base text-secondary">{children}</ol>
                  ),
                },
                marks: {
                  link: ({ children, value }) => (
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </article>
    </main>
  )
}
