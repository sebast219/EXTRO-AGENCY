import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const { pathname } = req.nextUrl

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
  matcher: ['/admin', '/admin/:path*', '/studio', '/studio/:path*'],
}
