import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const BASE_HOST = 'extro.com.co'

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host')?.toLowerCase() ?? ''

  if (host.startsWith('www.') && host.endsWith(`.${BASE_HOST}`)) {
    const url = req.nextUrl.clone()
    url.host = BASE_HOST
    url.protocol = 'https'
    return NextResponse.redirect(url, 301)
  }

  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/studio')) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET })

  if (pathname === '/admin/login') {
    if (token) return NextResponse.redirect(new URL('/admin', req.url))
    const res = NextResponse.next()
    addSecurityHeaders(res)
    return res
  }

  if (!token) {
    const url = new URL('/admin/login', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  const res = NextResponse.next()
  addSecurityHeaders(res)
  return res
}

function addSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.sanity.io; frame-src 'self'"
  )
}

export const config = {
  matcher: [
    '/',
    '/blog',
    '/blog/:path*',
    '/admin',
    '/admin/:path*',
    '/studio',
    '/studio/:path*',
    '/api/:path*',
    '/sitemap.xml',
    '/robots.txt',
  ],
}
