const rateMap = new Map<string, { count: number; resetAt: number }>()

const CLEANUP_INTERVAL = 60_000
if (typeof globalThis !== 'undefined') {
  const cleanup = setInterval(() => {
    const now = Date.now()
    rateMap.forEach((entry, key) => {
      if (now > entry.resetAt) rateMap.delete(key)
    })
    if (rateMap.size === 0) clearInterval(cleanup)
  }, CLEANUP_INTERVAL)
  if (cleanup.unref) cleanup.unref()
}

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
}

export function rateLimit(key: string, opts: RateLimitOptions): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true, remaining: opts.maxRequests - 1, resetAt: now + opts.windowMs }
  }

  entry.count++
  if (entry.count > opts.maxRequests) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { ok: true, remaining: opts.maxRequests - entry.count, resetAt: entry.resetAt }
}

export function getRateLimitHeaders(info: { remaining: number; resetAt: number }) {
  return {
    'X-RateLimit-Remaining': String(info.remaining),
    'X-RateLimit-Reset': String(info.resetAt),
  }
}
