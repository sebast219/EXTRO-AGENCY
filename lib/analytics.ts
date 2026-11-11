type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void

/** Sends a GA4 event. No-op when GA is not loaded (no ID, blocked, SSR). */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  gtag?.('event', name, params)
}
