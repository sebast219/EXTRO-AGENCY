import Script from 'next/script'
import { headers } from 'next/headers'

/**
 * GA4. Solo se renderiza si NEXT_PUBLIC_GA_ID está definido, así que en
 * desarrollo y previews sin la variable no se envía nada.
 *
 * El nonce de la CSP (proxy.ts) se lee del header de la petición: con
 * `strict-dynamic`, gtag.js hereda la confianza del script de arranque.
 */
export default async function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  )
}
