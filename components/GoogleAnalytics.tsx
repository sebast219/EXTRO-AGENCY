import Script from 'next/script'
import { headers } from 'next/headers'

/**
 * Google tag loader. Renders nothing unless an ID is configured, so dev and
 * previews without the variables send no data.
 *
 *  - NEXT_PUBLIC_GTM_ID (GTM-XXXX): Tag Manager container. Takes precedence;
 *    GA4 and any other tag are then managed from the GTM panel.
 *  - NEXT_PUBLIC_GA_ID (G-XXXX): direct gtag.js, only used without GTM so
 *    pageviews are never counted twice.
 *
 * The CSP nonce (proxy.ts) is read from the request headers: with
 * `strict-dynamic` the loaded script inherits trust from the bootstrap script.
 */
export default async function GoogleAnalytics() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID
  const ga = process.env.NEXT_PUBLIC_GA_ID
  const gtmId = gtm && /^GTM-[A-Z0-9]+$/.test(gtm) ? gtm : null
  const gaId = !gtmId && ga && /^G-[A-Z0-9]+$/.test(ga) ? ga : null
  if (!gtmId && !gaId) return null

  const nonce = (await headers()).get('x-nonce') ?? undefined

  if (gtmId) {
    return (
      <Script id="gtm-init" strategy="afterInteractive" nonce={nonce}>
        {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${gtmId}';s.nonce=${JSON.stringify(nonce ?? '')};document.head.appendChild(s);`}
      </Script>
    )
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" nonce={nonce} />
      <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  )
}
