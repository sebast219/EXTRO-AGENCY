import { z } from 'zod'

/**
 * A-3 / M-1: validación de entorno con fail-fast.
 *
 * Antes, la ausencia de RESEND_API_KEY hacía que las rutas respondieran
 * `{ ok: true, simulated: true }`: el visitante veía "Confirmado", nadie recibía
 * nada y no quedaba rastro. Aquí el arranque falla ruidosamente en producción y
 * solo se permite el modo simulado cuando se pide de forma explícita en
 * desarrollo.
 *
 * Este módulo es exclusivamente de servidor. No importarlo desde componentes de
 * cliente: contiene claves privadas.
 */

const isProd = process.env.NODE_ENV === 'production'

const emailish = z.string().trim().email()

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SITE_URL: z.string().url().default('https://extro.com.co'),

  // --- Correo (obligatorio en producción) -------------------------------
  RESEND_API_KEY: z.string().startsWith('re_').optional(),
  EMAIL_FROM: z.string().trim().min(3).default('EXTRO <hola@extro.com.co>'),
  CONTACT_TO: emailish.default('hola@extro.com.co'),

  /**
   * Escotilla de desarrollo. Con esto en '1' las rutas de correo registran el
   * envío en el log en vez de llamar a Resend. Nunca se admite en producción.
   */
  MAIL_DRY_RUN: z.enum(['0', '1']).default('0'),

  // --- Google Calendar + Meet (opcional; degrada sin él) -----------------
  GOOGLE_CALENDAR_ID: z.string().trim().optional(),
  // Modo A · Workspace: service account con delegación amplia de dominio.
  GOOGLE_SERVICE_ACCOUNT_EMAIL: emailish.optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_IMPERSONATE_EMAIL: emailish.optional(),
  // Modo B · Cuenta personal: OAuth2 con refresh token.
  GOOGLE_OAUTH_CLIENT_ID: z.string().trim().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().trim().optional(),
  GOOGLE_OAUTH_REFRESH_TOKEN: z.string().trim().optional(),

  BOOKING_TIMEZONE: z.string().trim().default('America/Bogota'),

  // --- Rate limiting distribuido (opcional; degrada a por-instancia) -----
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().trim().optional(),

  // --- Observabilidad (opcional) ----------------------------------------
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // --- CMS (opcional; degrada a contenido local) ------------------------
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().trim().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().trim().optional(),
  REVALIDATE_TOKEN: z.string().min(24).optional(),
})

export type ServerEnv = z.infer<typeof schema> & {
  mailEnabled: boolean
  mailDryRun: boolean
  googleMode: 'service-account' | 'oauth' | 'disabled'
  rateLimitDistributed: boolean
}

let cached: ServerEnv | null = null

function derive(raw: z.infer<typeof schema>): ServerEnv {
  const mailDryRun = raw.MAIL_DRY_RUN === '1' && raw.NODE_ENV !== 'production'

  const googleMode: ServerEnv['googleMode'] =
    raw.GOOGLE_CALENDAR_ID && raw.GOOGLE_SERVICE_ACCOUNT_EMAIL && raw.GOOGLE_PRIVATE_KEY
      ? 'service-account'
      : raw.GOOGLE_CALENDAR_ID &&
          raw.GOOGLE_OAUTH_CLIENT_ID &&
          raw.GOOGLE_OAUTH_CLIENT_SECRET &&
          raw.GOOGLE_OAUTH_REFRESH_TOKEN
        ? 'oauth'
        : 'disabled'

  return {
    ...raw,
    mailDryRun,
    mailEnabled: Boolean(raw.RESEND_API_KEY) || mailDryRun,
    googleMode,
    rateLimitDistributed: Boolean(raw.UPSTASH_REDIS_REST_URL && raw.UPSTASH_REDIS_REST_TOKEN),
  }
}

export function getServerEnv(): ServerEnv {
  if (cached) return cached

  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `  · ${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`Entorno inválido:\n${detail}`)
  }

  const env = derive(parsed.data)

  // Invariantes que solo aplican en producción.
  if (isProd) {
    const missing: string[] = []
    if (!env.RESEND_API_KEY) missing.push('RESEND_API_KEY')
    if (missing.length) {
      throw new Error(
        `Faltan variables obligatorias en producción: ${missing.join(', ')}. ` +
          'Sin ellas los formularios aceptarían envíos y descartarían los leads en silencio.'
      )
    }
    if (env.MAIL_DRY_RUN === '1') {
      throw new Error('MAIL_DRY_RUN=1 no se admite en producción.')
    }
  }

  cached = env
  return env
}

/** Solo para pruebas: descarta la caché entre casos. */
export function __resetEnvCache() {
  cached = null
}
