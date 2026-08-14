import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { getServerEnv } from './env'
import { log } from './observability/logger'

/**
 * C-4: sustituye al limitador anterior, que tenía dos defectos.
 *
 * 1. El contador vivía en un `Map` de módulo. En serverless cada instancia tiene
 *    su propia memoria, así que el límite ni se compartía ni sobrevivía.
 * 2. La clave se construía con la cabecera `x-forwarded-for` tal como llegaba.
 *    Enviando un valor distinto en cada petición se obtenía un bucket nuevo cada
 *    vez: el límite nunca se alcanzaba.
 *
 * Aquí la IP sale solo de cabeceras que fija la plataforma —el cliente no puede
 * falsificarlas porque el proxy las sobrescribe— y el contador vive en Redis
 * cuando hay credenciales de Upstash.
 */

export type RateVerdict = {
  ok: boolean
  remaining: number
  resetAt: number
}

/**
 * Cabeceras escritas por el proxy de la plataforma, en orden de confianza.
 * `x-forwarded-for` NO está en la lista a propósito: la controla el cliente.
 */
const TRUSTED_IP_HEADERS = [
  'x-vercel-forwarded-for', // Vercel, sobrescrita en el edge
  'cf-connecting-ip', // Cloudflare
  'x-real-ip', // nginx configurado por nosotros
] as const

export function clientIp(headers: Headers): string {
  for (const name of TRUSTED_IP_HEADERS) {
    const value = headers.get(name)?.split(',')[0]?.trim()
    if (value) return value
  }
  return 'unknown'
}

// --- Respaldo por instancia -------------------------------------------------
// Sin Upstash el límite es "mejor que nada": acota una ráfaga dentro de una
// misma instancia caliente, no un ataque distribuido. Se registra al arrancar
// para que la limitación quede explícita y no se descubra durante un incidente.

const localBuckets = new Map<string, { count: number; resetAt: number }>()

function localLimit(key: string, limit: number, windowMs: number): RateVerdict {
  const now = Date.now()
  const entry = localBuckets.get(key)

  if (!entry || now > entry.resetAt) {
    localBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  entry.count += 1

  // Poda oportunista: sin setInterval, que en serverless solo genera ruido.
  if (localBuckets.size > 5_000) {
    for (const [k, v] of localBuckets) if (now > v.resetAt) localBuckets.delete(k)
  }

  return {
    ok: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
  }
}

// --- Limitadores distribuidos ----------------------------------------------

type LimiterName = 'contact' | 'booking' | 'availability'

const CONFIG: Record<LimiterName, { limit: number; windowMs: number; window: `${number} m` }> = {
  contact: { limit: 3, windowMs: 60_000, window: '1 m' },
  booking: { limit: 3, windowMs: 60_000, window: '1 m' },
  availability: { limit: 60, windowMs: 60_000, window: '1 m' },
}

let redis: Redis | null = null
let limiters: Partial<Record<LimiterName, Ratelimit>> = {}
let warned = false

function getLimiter(name: LimiterName): Ratelimit | null {
  const env = getServerEnv()

  if (!env.rateLimitDistributed) {
    if (!warned) {
      warned = true
      log.warn('ratelimit.degraded', {
        reason: 'UPSTASH_REDIS_REST_URL/TOKEN no definidos',
        effect: 'el límite es por instancia y no protege frente a tráfico distribuido',
      })
    }
    return null
  }

  if (!redis) redis = Redis.fromEnv()

  const existing = limiters[name]
  if (existing) return existing

  const cfg = CONFIG[name]
  const created = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.limit, cfg.window),
    prefix: `rl:${name}`,
    analytics: true,
  })
  limiters[name] = created
  return created
}

export async function rateLimit(name: LimiterName, identifier: string): Promise<RateVerdict> {
  const cfg = CONFIG[name]
  const limiter = getLimiter(name)

  if (!limiter) {
    return localLimit(`${name}:${identifier}`, cfg.limit, cfg.windowMs)
  }

  try {
    const res = await limiter.limit(identifier)
    return { ok: res.success, remaining: res.remaining, resetAt: res.reset }
  } catch (err) {
    // Si Redis no responde, no se bloquea al usuario legítimo: se degrada al
    // límite local y se deja constancia.
    log.warn('ratelimit.backend_error', { name, err: String(err) })
    return localLimit(`${name}:${identifier}`, cfg.limit, cfg.windowMs)
  }
}

export function rateLimitHeaders(v: RateVerdict): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(v.remaining),
    'X-RateLimit-Reset': String(v.resetAt),
    'Retry-After': String(Math.max(1, Math.ceil((v.resetAt - Date.now()) / 1000))),
  }
}

/** Solo para pruebas. */
export function __resetRateLimitState() {
  localBuckets.clear()
  limiters = {}
  redis = null
  warned = false
}
