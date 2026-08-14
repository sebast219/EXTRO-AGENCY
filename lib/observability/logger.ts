/**
 * A-8 / B-7: logging estructurado.
 *
 * Antes había `console.error('Resend error:', error)` suelto en dos rutas. Eso
 * no es observable: no se puede filtrar, no se puede alertar y no lleva
 * contexto. Aquí cada entrada es una línea JSON con evento, nivel y campos, que
 * es lo que los recolectores de Vercel, Datadog o Axiom esperan.
 *
 * Si hay SENTRY_DSN definido, los errores se envían además a Sentry mediante su
 * API HTTP de "store", sin añadir el SDK al bundle.
 */

type Level = 'debug' | 'info' | 'warn' | 'error'

const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 }

type Fields = Record<string, unknown>

function minLevel(): Level {
  const raw = process.env.LOG_LEVEL
  return raw === 'debug' || raw === 'info' || raw === 'warn' || raw === 'error' ? raw : 'info'
}

/** Nunca dejar que un dato sensible entre en el log por descuido. */
const REDACTED = new Set(['password', 'token', 'secret', 'apiKey', 'authorization', 'privateKey'])

function scrub(fields: Fields): Fields {
  const out: Fields = {}
  for (const [k, v] of Object.entries(fields)) {
    if (REDACTED.has(k)) {
      out[k] = '[redacted]'
    } else if (k === 'email' && typeof v === 'string') {
      // Suficiente para correlacionar sin almacenar el correo completo.
      const [user, domain] = v.split('@')
      out[k] = domain ? `${user.slice(0, 2)}***@${domain}` : '[redacted]'
    } else if (v instanceof Error) {
      out[k] = { name: v.name, message: v.message, stack: v.stack }
    } else {
      out[k] = v
    }
  }
  return out
}

function emit(level: Level, event: string, fields: Fields = {}) {
  if (ORDER[level] < ORDER[minLevel()]) return

  const line = JSON.stringify({
    level,
    event,
    time: new Date().toISOString(),
    ...scrub(fields),
  })

  if (level === 'error') process.stderr.write(line + '\n')
  else process.stdout.write(line + '\n')
}

export const log = {
  debug: (event: string, fields?: Fields) => emit('debug', event, fields),
  info: (event: string, fields?: Fields) => emit('info', event, fields),
  warn: (event: string, fields?: Fields) => emit('warn', event, fields),
  error: (event: string, fields?: Fields) => emit('error', event, fields),
}

/**
 * Reporta un fallo a Sentry si está configurado. No lanza nunca: un fallo del
 * reporte de errores no puede tumbar la petición que lo originó.
 */
export async function captureException(err: unknown, context: Fields = {}): Promise<void> {
  const error = err instanceof Error ? err : new Error(String(err))
  log.error(String(context.event ?? 'unhandled_error'), { ...context, err: error })

  const dsn = process.env.SENTRY_DSN
  if (!dsn) return

  try {
    // DSN: https://<key>@<host>/<projectId>
    const parsed = new URL(dsn)
    const projectId = parsed.pathname.replace(/^\//, '')
    const endpoint = `${parsed.protocol}//${parsed.host}/api/${projectId}/store/`

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${parsed.username}, sentry_client=extron-web/1.1.0`,
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        platform: 'node',
        level: 'error',
        environment: process.env.NODE_ENV,
        exception: {
          values: [{ type: error.name, value: error.message, stacktrace: { frames: [] } }],
        },
        extra: scrub(context),
      }),
      // No bloquear la respuesta al usuario por el reporte.
      signal: AbortSignal.timeout(2000),
    })
  } catch {
    // Silencio deliberado: ya quedó en stderr.
  }
}
