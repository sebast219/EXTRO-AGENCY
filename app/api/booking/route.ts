import { getServerEnv } from '@/lib/env'
import { bookingSchema } from '@/lib/contracts'
import { readJson, fail, ok } from '@/lib/http'
import { clientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { sendMail, bookingConfirmation, bookingNotification } from '@/lib/mail'
import { createMeeting, getBusyForDate, isCalendarEnabled } from '@/lib/google/calendar'
import { isBookable } from '@/features/booking/availability'
import { formatDateLong, to12h } from '@/features/booking/time'
import { log, captureException } from '@/lib/observability/logger'

export const runtime = 'nodejs'

/**
 * C-2 + automatización de la reunión.
 *
 * Secuencia: validar → comprobar contra la agenda real → crear el evento con
 * sala de Meet → confirmar al cliente → avisar al equipo.
 *
 * El orden importa. El evento se crea antes que los correos porque el enlace de
 * Meet forma parte del cuerpo de la confirmación. Si la creación falla, la
 * reserva NO se aborta: se envían los correos sin enlace y se registra el fallo.
 * Perder el lead por una caída de la API de Google sería peor que una reunión
 * sin enlace automático.
 */
export async function POST(req: Request) {
  const ip = clientIp(req.headers)
  const rl = await rateLimit('booking', ip)
  if (!rl.ok) return fail('Demasiadas solicitudes. Espera un minuto.', 429, rateLimitHeaders(rl))

  const parsed = await readJson(req, bookingSchema)
  if (!parsed.ok) return parsed.response

  const { name, email, date, time, notes, locale, website } = parsed.data

  if (website) {
    log.info('booking.honeypot', { ip })
    return ok({})
  }

  const env = getServerEnv()
  const tz = env.BOOKING_TIMEZONE
  const es = locale === 'es'

  // Validación de servidor: el cliente no decide si un hueco es reservable.
  const busy = await getBusyForDate(date, tz)
  const verdict = isBookable(date, time, { timeZone: tz, busy })

  if (!verdict.ok) {
    const message =
      verdict.reason === 'busy'
        ? es
          ? 'Ese horario acaba de ocuparse. Elige otro, por favor.'
          : 'That slot was just taken. Please pick another one.'
        : es
          ? 'Ese horario ya no está disponible.'
          : 'That slot is no longer available.'
    log.info('booking.rejected', { date, time, reason: verdict.reason })
    return fail(message, verdict.reason === 'busy' ? 409 : 400)
  }

  const dateLabel = formatDateLong(date, locale, tz)
  const timeLabel = to12h(time)

  // 1 · Evento con sala de Meet.
  const meeting = await createMeeting({
    date,
    time,
    timeZone: tz,
    attendeeName: name,
    attendeeEmail: email,
    notes,
    locale,
  })

  if (!meeting && isCalendarEnabled()) {
    // Ya quedó capturado en el adaptador; aquí solo se marca el impacto.
    log.warn('booking.calendar_unavailable', { date, time })
  }

  // 2 · Confirmación al cliente, con saludo y enlace.
  const confirmation = await sendMail({
    event: 'booking.confirmation',
    to: email,
    subject: es
      ? `Reunión confirmada · ${dateLabel} a las ${timeLabel}`
      : `Meeting confirmed · ${dateLabel} at ${timeLabel}`,
    html: bookingConfirmation({
      name,
      dateLabel,
      timeLabel,
      timeZoneLabel: tz.replace('_', ' '),
      meetUrl: meeting?.meetUrl ?? null,
      locale,
    }),
  })

  if (!confirmation.ok) {
    await captureException(new Error(confirmation.error), {
      event: 'booking.confirmation_failed',
      email,
      date,
      time,
    })
  }

  // 3 · Aviso interno. Un fallo aquí no afecta a la respuesta del cliente.
  const notification = await sendMail({
    event: 'booking.notification',
    to: env.CONTACT_TO,
    replyTo: email,
    subject: `Intro call · ${name} · ${dateLabel} ${timeLabel}`,
    html: bookingNotification({
      name,
      email,
      dateLabel,
      timeLabel,
      notes,
      meetUrl: meeting?.meetUrl ?? null,
    }),
  })

  // Si ninguno de los dos correos salió y tampoco hay evento, no hay ningún
  // rastro de la reserva: eso sí es un fallo que el usuario debe conocer.
  if (!confirmation.ok && !notification.ok && !meeting) {
    return fail(
      es ? 'No se pudo agendar. Inténtalo de nuevo.' : 'Could not book. Please try again.',
      502
    )
  }

  log.info('booking.confirmed', {
    email,
    date,
    time,
    hasMeet: Boolean(meeting?.meetUrl),
    eventId: meeting?.eventId,
  })

  return ok({
    date,
    time,
    dateLabel,
    timeLabel,
    meetUrl: meeting?.meetUrl ?? null,
  })
}
