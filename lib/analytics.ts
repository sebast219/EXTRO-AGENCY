type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void
type Win = { gtag?: Gtag; dataLayer?: Record<string, unknown>[] }

/**
 * Sends an analytics event. Uses gtag when the direct GA4 tag is loaded and
 * falls back to a dataLayer push (a GTM custom event named like the event).
 * No-op on the server.
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as Win
  if (w.gtag) {
    w.gtag('event', name, params)
    return
  }
  if (w.dataLayer) w.dataLayer.push({ event: name, ...params })
}
