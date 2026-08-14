import { ALL_SLOTS, MIN_LEAD_MINUTES, SLOT_MINUTES } from './slots'
import { zonedToUtc, type DateISO, type Time24 } from './time'

/**
 * C-2: disponibilidad real, con una capa opcional de escasez simulada.
 *
 * Reglas, en orden de precedencia. Las tres primeras son duras; la cuarta es de
 * marketing y está subordinada a ellas.
 *
 *  1. Un hueco con reserva real SIEMPRE está ocupado.
 *  2. Un hueco pasado (o dentro del margen mínimo) nunca es reservable.
 *  3. Siempre quedan al menos `minFree` huecos libres por día. Este límite es el
 *     que impide que la capa de marketing acabe costando clientes: sin él, con
 *     una proporción alta y pocas reservas reales el día podría aparecer casi
 *     lleno y el visitante se marcharía.
 *  4. Sobre lo que queda, se marcan huecos adicionales como ocupados de forma
 *     determinista por fecha.
 *
 * La cuarta regla es una decisión de negocio explícita del propietario del
 * sitio, tomada tras señalarse en la auditoría que la escasez simulada es un
 * patrón oscuro y que en Colombia puede leerse como publicidad engañosa ante la
 * SIC. Se implementa acotada y se apaga con `NEXT_PUBLIC_FOMO_SLOTS=0` sin tocar
 * código.
 *
 * La distinción entre ocupado real y simulado nunca sale del servidor: la API
 * devuelve una sola lista de horas ocupadas.
 */

export type BusyInterval = { start: Date; end: Date }

export type FomoConfig = {
  /** Proporción de los huecos libres restantes que se marcan como ocupados. 0 lo desactiva. */
  ratio: number
  /** Huecos que nunca se ocultan, por día. */
  minFree: number
  /** Cambia el patrón sin cambiar el código. */
  salt: string
}

export const DEFAULT_FOMO: FomoConfig = { ratio: 0.25, minFree: 6, salt: 'extro-v1' }

export function fomoFromEnv(raw: string | undefined): FomoConfig {
  if (raw === undefined || raw === '') return DEFAULT_FOMO
  const ratio = Number(raw)
  if (!Number.isFinite(ratio) || ratio <= 0) return { ...DEFAULT_FOMO, ratio: 0 }
  return { ...DEFAULT_FOMO, ratio: Math.min(ratio, 0.6) }
}

/** FNV-1a de 32 bits: estable entre procesos y bien distribuido. */
function hash32(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

function overlapsBusy(slotStart: Date, busy: BusyInterval[]): boolean {
  const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60_000)
  return busy.some((b) => slotStart < b.end && slotEnd > b.start)
}

export type AvailabilityInput = {
  date: DateISO
  timeZone: string
  /** Intervalos ocupados reales, tal como los devuelve el calendario. */
  busy: BusyInterval[]
  now?: Date
  fomo?: FomoConfig
}

export type AvailabilityResult = {
  /** Horas no reservables, sin distinguir el motivo. Es lo que ve el cliente. */
  taken: Time24[]
  /** Horas reservables. */
  free: Time24[]
  /** Desglose interno para logs y pruebas. Nunca se serializa a la respuesta. */
  breakdown: { past: Time24[]; booked: Time24[]; simulated: Time24[] }
}

export function computeAvailability(input: AvailabilityInput): AvailabilityResult {
  const { date, timeZone, busy } = input
  const now = input.now ?? new Date()
  const fomo = input.fomo ?? DEFAULT_FOMO

  const earliest = new Date(now.getTime() + MIN_LEAD_MINUTES * 60_000)

  const past: Time24[] = []
  const booked: Time24[] = []
  let candidates: Time24[] = []

  for (const time of ALL_SLOTS) {
    const start = zonedToUtc(date, time, timeZone)
    if (start < earliest) {
      past.push(time)
      continue
    }
    if (overlapsBusy(start, busy)) {
      booked.push(time)
      continue
    }
    candidates.push(time)
  }

  // Regla 3 antes que la 4: el mínimo de huecos libres manda sobre el efecto.
  const desired = Math.floor(candidates.length * fomo.ratio)
  const allowed = Math.max(0, candidates.length - fomo.minFree)
  const fakeCount = Math.min(desired, allowed)

  let simulated: Time24[] = []
  if (fakeCount > 0) {
    simulated = [...candidates]
      .map((time) => ({ time, weight: hash32(`${fomo.salt}|${date}|${time}`) }))
      .sort((a, b) => a.weight - b.weight)
      .slice(0, fakeCount)
      .map((x) => x.time)

    const hidden = new Set(simulated)
    candidates = candidates.filter((t) => !hidden.has(t))
  }

  const taken = ALL_SLOTS.filter((t) => !candidates.includes(t))

  return { taken, free: candidates, breakdown: { past, booked, simulated } }
}

/**
 * Comprobación de servidor en el momento de reservar.
 *
 * Deliberadamente ignora los huecos simulados: si un cliente llega con una hora
 * que la capa de marketing ocultaba, la reserva se acepta. Bloquearla sería
 * perder un cliente real por un adorno.
 */
export function isBookable(
  date: DateISO,
  time: Time24,
  opts: { timeZone: string; busy: BusyInterval[]; now?: Date }
): { ok: true } | { ok: false; reason: 'past' | 'busy' | 'unknown-slot' } {
  if (!(ALL_SLOTS as string[]).includes(time)) return { ok: false, reason: 'unknown-slot' }

  const now = opts.now ?? new Date()
  const start = zonedToUtc(date, time, opts.timeZone)

  if (start < new Date(now.getTime() + MIN_LEAD_MINUTES * 60_000)) {
    return { ok: false, reason: 'past' }
  }
  if (overlapsBusy(start, opts.busy)) return { ok: false, reason: 'busy' }

  return { ok: true }
}
