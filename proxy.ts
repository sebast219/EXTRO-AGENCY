import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, detectLocale, isCrawler, isLocale, type Locale } from '@/lib/i18n/config'

const BASE_HOST = 'extro.com.co'

/** Rutas que no pertenecen al sitio localizado y pasan sin reescritura. */
const PASSTHROUGH = ['/api', '/studio', '/sitemap.xml', '/robots.txt', '/og.png']

/**
 * A-4: CSP estricta basada en nonce para todo el sitio.
 *
 * `strict-dynamic` hace que los scripts cargados por un script con nonce válido
 * hereden la confianza, que es como Next.js carga sus chunks. Con eso no hace
 * falta `unsafe-inline` en script-src, que era lo que anulaba el valor de la
 * política anterior.
 *
 * Dos excepciones acotadas y deliberadas:
 *  - `/studio` (Sanity Studio) necesita `unsafe-eval`. Solo ahí.
 *  - En desarrollo, el refresh de Next necesita `unsafe-eval`.
 *
 * `unsafe-inline` se mantiene en style-src: Tailwind y los `style={{}}` de los
 * componentes son atributos de estilo en línea, y su riesgo es órdenes de
 * magnitud menor que el de un script.
 */
function buildCsp(nonce: string, opts: { studio: boolean; dev: boolean }): string {
  const needsEval = opts.studio || opts.dev

  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${needsEval ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://cdn.sanity.io https://*.google-analytics.com https://*.googletagmanager.com`,
    `font-src 'self' data:`,
    `connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
    `frame-src 'self' https://meet.google.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}

function applySecurityHeaders(res: NextResponse, csp: string) {
  res.headers.set('Content-Security-Policy', csp)
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  // La respuesta depende del idioma del dispositivo y de la preferencia manual.
  res.headers.append('Vary', 'Accept-Language, Cookie')
}

/**
 * M-3: resolución de idioma.
 *
 * El español no lleva prefijo para no invalidar las URLs ya indexadas, así que
 * `/blog` se reescribe internamente a `/es/blog` sin que cambie la barra de
 * direcciones. `/en/blog` ya coincide con el segmento [lang] y pasa tal cual.
 *
 * Orden de prioridad:
 *  1. Prefijo explícito en la URL: manda siempre (`/en/...`).
 *  2. Cookie `extro-lang`: es una elección manual del selector y sobrevive
 *     entre visitas. Solo el selector la escribe; la autodetección NO la
 *     persiste, para que el dispositivo pueda cambiar de idioma.
 *  3. `Accept-Language` del dispositivo.
 *  4. Español como idioma por defecto.
 *
 * Los rastreadores se tratan como español y nunca se redirigen: su
 * `Accept-Language` no representa a una persona y la redirección rompería la
 * relación entre las URLs y sus alternativas hreflang.
 */
function preferredLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get('extro-lang')?.value
  if (isLocale(cookie)) return cookie
  if (isCrawler(req.headers.get('user-agent'))) return DEFAULT_LOCALE
  return detectLocale(req.headers.get('accept-language'))
}


export function proxy(req: NextRequest) {
  const host = req.headers.get('host')?.toLowerCase() ?? ''

  // www -> apex, 301. vercel.json no aplica la regla en despliegues por CLI.
  if (host.startsWith('www.') && host.endsWith(`.${BASE_HOST}`)) {
    const url = req.nextUrl.clone()
    url.host = BASE_HOST
    url.protocol = 'https'
    return NextResponse.redirect(url, 301)
  }

  const { pathname } = req.nextUrl
  const nonce = crypto.randomUUID().replace(/-/g, '')
  const csp = buildCsp(nonce, {
    studio: pathname.startsWith('/studio'),
    dev: process.env.NODE_ENV === 'development',
  })

  // El nonce y la CSP viajan en la petición: Next.js los detecta y estampa el
  // nonce en los <script> que renderiza.
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('content-security-policy', csp)

  const isPassthrough = PASSTHROUGH.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  let res: NextResponse
  if (isPassthrough) {
    res = NextResponse.next({ request: { headers: requestHeaders } })
  } else if (pathname === '/en' || pathname.startsWith('/en/')) {
    // Idioma explícito en la URL: no se toca.
    res = NextResponse.next({ request: { headers: requestHeaders } })
  } else {
    const locale = preferredLocale(req)

    if (locale === 'en') {
      // Redirección visible (307, temporal) para que la URL canónica y la que
      // ve el usuario coincidan. No se guarda cookie: es una preferencia del
      // dispositivo, no una elección manual.
      const url = req.nextUrl.clone()
      url.pathname = `/en${pathname === '/' ? '' : pathname}`
      res = NextResponse.redirect(url, 307)
      applySecurityHeaders(res, csp)
      return res
    }

    const url = req.nextUrl.clone()
    url.pathname = `/es${pathname === '/' ? '' : pathname}`
    res = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }

  applySecurityHeaders(res, csp)
  return res
}

export const config = {
  matcher: [
    /*
     * Todas las rutas salvo assets estáticos y el optimizador de imágenes, que
     * no ejecutan scripts y no necesitan ni CSP ni resolución de idioma.
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-touch-icon.png|images/).*)',
  ],
}
