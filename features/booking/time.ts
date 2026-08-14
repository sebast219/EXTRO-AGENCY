/**
 * M-9 / B-3: aritmética de fechas con zona horaria explícita, en un solo sitio.
 *
 * El código anterior hacía `new Date(iso + 'T00:00:00')` (se interpreta en la
 * zona del servidor: en Vercel, UTC) y repetía
 * `${y}-${String(m+1).padStart(2,'0')}-...` en tres lugares distintos de
 * Contact.tsx. Ambas cosas viven aquí ahora.
 */

/** Fecha civil 'YYYY-MM-DD'. */
export type DateISO = string
/** Hora civil 24 h 'HH:mm'. */
export type Time24 = string

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

function parts(tz: string, at: Date) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const map = new Map<string, string>(dtf.formatToParts(at).map((p) => [p.type as string, p.value]))
  const n = (t: string) => Number(map.get(t))
  // Intl devuelve 24 para medianoche en hour12:false; normalizar a 0.
  const hour = n('hour') % 24
  return { year: n('year'), month: n('month'), day: n('day'), hour, minute: n('minute'), second: n('second') }
}

/** Desfase de la zona respecto de UTC, en minutos, en ese instante. */
function offsetMinutes(tz: string, at: Date): number {
  const p = parts(tz, at)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return (asUtc - at.getTime()) / 60_000
}

/**
 * Convierte una hora de pared en una zona al instante UTC correspondiente.
 * Dos pasadas para que el resultado sea correcto también junto a un cambio de
 * horario de verano (Bogotá no lo tiene, pero la función no debe asumirlo).
 */
export function zonedToUtc(date: DateISO, time: Time24, tz: string): Date {
  const naive = new Date(`${date}T${time}:00Z`)
  let result = new Date(naive.getTime() - offsetMinutes(tz, naive) * 60_000)
  result = new Date(naive.getTime() - offsetMinutes(tz, result) * 60_000)
  return result
}

/** Fecha civil de hoy en la zona indicada. */
export function todayISO(tz: string, now: Date = new Date()): DateISO {
  const p = parts(tz, now)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

/** Hora civil actual en la zona indicada. */
export function nowTime24(tz: string, now: Date = new Date()): Time24 {
  const p = parts(tz, now)
  return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
}

/** Fecha civil a partir de sus componentes locales, sin pasar por Date. */
export function toDateISO(year: number, month0: number, day: number): DateISO {
  return `${year}-${String(month0 + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function isWeekend(date: DateISO): boolean {
  // Mediodía UTC evita que el día bascule por el desfase de zona.
  const d = new Date(`${date}T12:00:00Z`)
  const dow = d.getUTCDay()
  return dow === 0 || dow === 6
}

export function addDaysISO(date: DateISO, days: number): DateISO {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** '14:30' -> '2:30 PM'. La UI muestra 12 h; el dominio trabaja en 24 h. */
export function to12h(time: Time24): string {
  const [h, m] = time.split(':').map(Number)
  const suffix = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

/** Fecha legible en el idioma dado, sin depender de la zona del servidor. */
export function formatDateLong(date: DateISO, locale: 'es' | 'en', tz: string): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CO' : 'en-US', {
    timeZone: tz,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00Z`))
}
