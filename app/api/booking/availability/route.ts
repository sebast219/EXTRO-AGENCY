import { getServerEnv } from '@/lib/env'
import { availabilityQuerySchema, firstIssue } from '@/lib/contracts'
import { fail, ok } from '@/lib/http'
import { clientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { getBusyForDate } from '@/lib/google/calendar'
import { computeAvailability, fomoFromEnv } from '@/features/booking/availability'
import { BOOKING_HORIZON_DAYS } from '@/features/booking/slots'
import { addDaysISO, todayISO } from '@/features/booking/time'
import { log } from '@/lib/observability/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * C-2: disponibilidad real del día pedido.
 *
 * La respuesta es una sola lista de horas ocupadas. El desglose entre reservas
 * reales y la capa de escasez no sale del servidor: si saliera, cualquiera
 * podría distinguirlas desde el navegador.
 */
export async function GET(req: Request) {
  const ip = clientIp(req.headers)
  const rl = await rateLimit('availability', ip)
  if (!rl.ok) return fail('Demasiadas solicitudes.', 429, rateLimitHeaders(rl))

  const { searchParams } = new URL(req.url)
  const parsed = availabilityQuerySchema.safeParse({ date: searchParams.get('date') })
  if (!parsed.success) return fail(firstIssue(parsed.error), 400)

  const env = getServerEnv()
  const tz = env.BOOKING_TIMEZONE
  const { date } = parsed.data

  const today = todayISO(tz)
  if (date < today || date > addDaysISO(today, BOOKING_HORIZON_DAYS)) {
    return fail('Esa fecha está fuera del rango de agenda.', 400)
  }

  const busy = await getBusyForDate(date, tz)
  const availability = computeAvailability({
    date,
    timeZone: tz,
    busy,
    fomo: fomoFromEnv(process.env.NEXT_PUBLIC_FOMO_SLOTS),
  })

  log.debug('availability.served', {
    date,
    free: availability.free.length,
    booked: availability.breakdown.booked.length,
    simulated: availability.breakdown.simulated.length,
  })

  return ok(
    { date, taken: availability.taken, free: availability.free },
    { 'Cache-Control': 'private, max-age=30' }
  )
}
