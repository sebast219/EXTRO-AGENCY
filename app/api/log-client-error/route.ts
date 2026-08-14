import { z } from 'zod'
import { readJson, fail, ok } from '@/lib/http'
import { clientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { captureException } from '@/lib/observability/logger'

export const runtime = 'nodejs'

/**
 * Cierra el último `console.error` suelto del proyecto (deuda B pendiente).
 *
 * `app/(site)/[lang]/blog/error.tsx` es un error boundary de cliente: no puede
 * importar `lib/observability/logger.ts` directamente porque ese módulo escribe
 * a `process.stdout`/`stderr`, que no existen en el navegador. Antes el fallo
 * se quedaba en la consola del visitante y en ningún otro sitio — nadie del
 * equipo se enteraba de un render roto en producción. Este endpoint reenvía el
 * error al mismo pipeline estructurado (log JSON + Sentry si está configurado)
 * que ya usan las rutas de servidor.
 */

const clientErrorSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  digest: z.string().trim().max(64).optional(),
  path: z.string().trim().max(300).optional(),
})

export async function POST(req: Request) {
  // Mismo límite que /api/booking/availability: es telemetría, no un formulario
  // que deba tratarse como intento de conversión.
  const ip = clientIp(req.headers)
  const rl = await rateLimit('availability', ip)
  if (!rl.ok) return fail('Demasiadas solicitudes.', 429, rateLimitHeaders(rl))

  const parsed = await readJson(req, clientErrorSchema)
  if (!parsed.ok) return parsed.response

  await captureException(new Error(parsed.data.message), {
    event: 'client.render_error',
    digest: parsed.data.digest,
    path: parsed.data.path,
  })

  return ok({})
}
