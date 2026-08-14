import { calendar as googleCalendar, type calendar_v3 } from '@googleapis/calendar'
import { JWT, OAuth2Client } from 'google-auth-library'
import { getServerEnv } from '@/lib/env'
import { log, captureException } from '@/lib/observability/logger'
import type { BusyInterval } from '@/features/booking/availability'
import { SLOT_MINUTES } from '@/features/booking/slots'
import { zonedToUtc, type DateISO, type Time24 } from '@/features/booking/time'

/**
 * Adaptador de Google Calendar. Cumple dos funciones:
 *
 *  1. Fuente de verdad de la disponibilidad (`freebusy`). Con esto el calendario
 *     del sitio refleja la agenda real y no hace falta una base de datos propia
 *     solo para las reservas.
 *  2. Creación del evento con enlace de Google Meet, que es lo que se envía al
 *     cliente en el correo de confirmación.
 *
 * Autenticación, dos modos:
 *
 *  A · Service account con delegación amplia de dominio (Google Workspace).
 *      Requiere GOOGLE_IMPERSONATE_EMAIL. Es el único modo en el que una service
 *      account puede generar enlaces de Meet: Meet exige un usuario real como
 *      organizador, así que la cuenta suplanta a ese usuario.
 *
 *  B · OAuth2 con refresh token (cuenta de Gmail normal). Para cuando no hay
 *      Workspace. El token se obtiene una vez con el flujo de consentimiento y
 *      se guarda como variable de entorno.
 *
 * Sin credenciales el módulo se desactiva por completo: la disponibilidad pasa a
 * ser solo la capa local y la reserva sigue funcionando, pero sin enlace de
 * Meet. Nunca lanza hacia la ruta de API.
 */

const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly']

let client: calendar_v3.Calendar | null = null

function getClient(): calendar_v3.Calendar | null {
  const env = getServerEnv()
  if (env.googleMode === 'disabled') return null
  if (client) return client

  if (env.googleMode === 'service-account') {
    if (!env.GOOGLE_IMPERSONATE_EMAIL) {
      log.warn('google.no_impersonation', {
        effect: 'la service account no podrá crear enlaces de Meet',
        fix: 'define GOOGLE_IMPERSONATE_EMAIL con un usuario de Workspace',
      })
    }
    const auth = new JWT({
      email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Las variables de entorno escapan los saltos de línea de la clave PEM.
      key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: SCOPES,
      subject: env.GOOGLE_IMPERSONATE_EMAIL,
    })
    client = googleCalendar({ version: 'v3', auth })
  } else {
    const auth = new OAuth2Client({
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    })
    auth.setCredentials({ refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN })
    client = googleCalendar({ version: 'v3', auth })
  }

  return client
}

export function isCalendarEnabled(): boolean {
  return getServerEnv().googleMode !== 'disabled'
}

/**
 * Intervalos ocupados del día. Devuelve [] si el calendario está desactivado o
 * si la consulta falla: una caída de Google no puede dejar el sitio sin
 * calendario, solo sin datos reales de ocupación.
 */
export async function getBusyForDate(date: DateISO, timeZone: string): Promise<BusyInterval[]> {
  const cal = getClient()
  const env = getServerEnv()
  if (!cal || !env.GOOGLE_CALENDAR_ID) return []

  try {
    const res = await cal.freebusy.query({
      requestBody: {
        timeMin: zonedToUtc(date, '00:00', timeZone).toISOString(),
        timeMax: zonedToUtc(date, '23:59', timeZone).toISOString(),
        timeZone,
        items: [{ id: env.GOOGLE_CALENDAR_ID }],
      },
    })

    const periods = res.data.calendars?.[env.GOOGLE_CALENDAR_ID]?.busy ?? []
    return periods
      .filter((p): p is { start: string; end: string } => Boolean(p.start && p.end))
      .map((p) => ({ start: new Date(p.start), end: new Date(p.end) }))
  } catch (err) {
    await captureException(err, { event: 'google.freebusy_failed', date })
    return []
  }
}

export type MeetingRequest = {
  date: DateISO
  time: Time24
  timeZone: string
  attendeeName: string
  attendeeEmail: string
  notes?: string
  locale: 'es' | 'en'
}

export type MeetingResult = {
  eventId: string
  meetUrl: string | null
  htmlLink: string | null
}

/**
 * Crea el evento y solicita una sala de Meet.
 *
 * `sendUpdates: 'all'` hace que Google mande su propia invitación con el botón
 * de "añadir al calendario". El correo de confirmación que enviamos aparte es
 * el que lleva el saludo y el enlace en el cuerpo, porque la invitación de
 * Google es fría y a menudo cae en Promociones.
 */
export async function createMeeting(req: MeetingRequest): Promise<MeetingResult | null> {
  const cal = getClient()
  const env = getServerEnv()
  if (!cal || !env.GOOGLE_CALENDAR_ID) return null

  const start = zonedToUtc(req.date, req.time, req.timeZone)
  const end = new Date(start.getTime() + SLOT_MINUTES * 60_000)

  const summary =
    req.locale === 'es'
      ? `EXTRO · Llamada de introducción con ${req.attendeeName}`
      : `EXTRO · Intro call with ${req.attendeeName}`

  const description = [
    req.locale === 'es'
      ? `Llamada de ${SLOT_MINUTES} minutos para entender el proyecto y dar un rango de precio cerrado.`
      : `${SLOT_MINUTES}-minute call to scope the project and give a fixed price range.`,
    '',
    `${req.locale === 'es' ? 'Contacto' : 'Contact'}: ${req.attendeeName} <${req.attendeeEmail}>`,
    req.notes ? `${req.locale === 'es' ? 'Notas' : 'Notes'}: ${req.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const res = await cal.events.insert({
      calendarId: env.GOOGLE_CALENDAR_ID,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: {
        summary,
        description,
        start: { dateTime: start.toISOString(), timeZone: req.timeZone },
        end: { dateTime: end.toISOString(), timeZone: req.timeZone },
        attendees: [{ email: req.attendeeEmail, displayName: req.attendeeName }],
        conferenceData: {
          createRequest: {
            // Debe ser único por petición; si se repite, Google reutiliza la sala.
            requestId: `extro-${req.date}-${req.time.replace(':', '')}-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      },
    })

    const meetUrl =
      res.data.hangoutLink ??
      res.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri ??
      null

    if (!meetUrl) {
      log.warn('google.meet_link_missing', {
        eventId: res.data.id,
        hint: 'sin delegación amplia de dominio la service account no genera sala de Meet',
      })
    }

    return { eventId: res.data.id ?? '', meetUrl, htmlLink: res.data.htmlLink ?? null }
  } catch (err) {
    await captureException(err, {
      event: 'google.event_insert_failed',
      date: req.date,
      time: req.time,
    })
    return null
  }
}
