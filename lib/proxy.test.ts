import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Fixture: one post with an English version, one Spanish-only post.
vi.mock('@/lib/blog-slugs', () => ({
  BLOG_SLUGS: { a: { es: 'con-traduccion', en: 'with-translation' }, b: { es: 'solo-es' } },
}))

import { proxy } from '../proxy'
import { esBlogRedirect, enBlogRedirect, blogAlternates } from '@/lib/content/blog-i18n'

const HUMAN_EN = { 'accept-language': 'en-US,en;q=0.9', 'user-agent': 'Mozilla/5.0' }
const HUMAN_ES = { 'accept-language': 'es-CO,es;q=0.9', 'user-agent': 'Mozilla/5.0' }

function run(path: string, headers: Record<string, string> = HUMAN_ES) {
  return proxy(new NextRequest(`https://extro.com.co${path}`, { headers: { host: 'extro.com.co', ...headers } }))
}
const loc = (r: Response) => new URL(r.headers.get('location') ?? '', 'https://extro.com.co').pathname

describe('blog redirect rules (pure)', () => {
  it('mirror rule maps an English slug to the Spanish one', () => {
    expect(esBlogRedirect('with-translation')).toBe('/blog/con-traduccion')
    expect(esBlogRedirect('con-traduccion')).toBeNull()
    expect(esBlogRedirect('unknown')).toBeNull()
  })
  it('a Spanish-only post under /en goes to the Spanish URL', () => {
    expect(enBlogRedirect('solo-es')).toBe('/blog/solo-es')
  })
  it('blogAlternates never builds /blog/undefined', () => {
    expect(blogAlternates({ es: 'a' }, 'en')).toEqual({})
    expect(JSON.stringify(blogAlternates({ en: 'b' }, 'es'))).not.toContain('undefined')
  })
})

describe('proxy', () => {
  it('B1: /blog/<english-slug> answers 301 to /blog/<spanish-slug>', () => {
    const res = run('/blog/with-translation', HUMAN_EN)
    expect(res.status).toBe(301)
    expect(loc(res)).toBe('/blog/con-traduccion')
  })

  it('/en/blog/<spanish-slug> answers 301 to the English slug', () => {
    const res = run('/en/blog/con-traduccion')
    expect(res.status).toBe(301)
    expect(loc(res)).toBe('/en/blog/with-translation')
  })

  it('/en/blog/<spanish-only> answers 301 to the Spanish URL without cookies', () => {
    const res = run('/en/blog/solo-es', HUMAN_EN)
    expect(res.status).toBe(301)
    expect(loc(res)).toBe('/blog/solo-es')
    expect(res.headers.get('set-cookie')).toBeNull()
  })

  it('A1: an English device on a Spanish-only post is served in Spanish (no loop)', () => {
    const res = run('/blog/solo-es', HUMAN_EN)
    expect(res.status).toBe(200)
    expect(res.headers.get('x-middleware-rewrite')).toContain('/es/blog/solo-es')
  })

  it('an English device on a translated post gets a 307 straight to the English slug', () => {
    const res = run('/blog/con-traduccion', HUMAN_EN)
    expect(res.status).toBe(307)
    expect(loc(res)).toBe('/en/blog/with-translation')
  })

  it('an English device on the home gets a 307 to /en', () => {
    const res = run('/', HUMAN_EN)
    expect(res.status).toBe(307)
    expect(loc(res)).toBe('/en')
  })

  it('bots are never redirected by language', () => {
    const res = run('/', { 'accept-language': 'en-US', 'user-agent': 'Googlebot/2.1' })
    expect(res.status).toBe(200)
    expect(res.headers.get('x-middleware-rewrite')).toContain('/es')
  })

  it('/studio and /api pass through untouched', () => {
    for (const p of ['/studio', '/api/health']) {
      const res = run(p, HUMAN_EN)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-middleware-rewrite')).toBeNull()
      expect(res.headers.get('location')).toBeNull()
    }
  })
})
