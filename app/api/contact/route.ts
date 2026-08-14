import { getServerEnv } from '@/lib/env'
import { contactSchema, PROJECT_LABELS } from '@/lib/contracts'
import { readJson, fail, ok } from '@/lib/http'
import { clientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { sendMail, contactNotification } from '@/lib/mail'
import { log } from '@/lib/observability/logger'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const ip = clientIp(req.headers)
  const rl = await rateLimit('contact', ip)
  if (!rl.ok) {
    return fail('Demasiadas solicitudes. Espera un minuto.', 429, rateLimitHeaders(rl))
  }

  const parsed = await readJson(req, contactSchema)
  if (!parsed.ok) return parsed.response

  const { name, email, project, message, locale, website } = parsed.data

  // Campo trampa relleno: es un bot. Se responde 200 para no darle señal.
  if (website) {
    log.info('contact.honeypot', { ip })
    return ok({})
  }

  const env = getServerEnv()
  const result = await sendMail({
    event: 'contact',
    to: env.CONTACT_TO,
    replyTo: email,
    subject: `Nuevo mensaje de contacto · ${name}`,
    html: contactNotification({
      name,
      email,
      project: PROJECT_LABELS[project][locale],
      message,
    }),
  })

  if (!result.ok) {
    return fail('No se pudo enviar el mensaje. Inténtalo de nuevo.', 502)
  }

  log.info('contact.received', { email, project })
  return ok({ id: result.id })
}
