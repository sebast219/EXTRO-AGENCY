import type { Time24 } from './time'

/** Duración de la llamada de introducción, en minutos. */
export const SLOT_MINUTES = 15

/** Con cuánta antelación mínima se puede reservar. Evita reservas para "dentro de 2 minutos". */
export const MIN_LEAD_MINUTES = 60

/** Hasta cuántos días hacia adelante se abre el calendario. */
export const BOOKING_HORIZON_DAYS = 60

function range(startHour: number, startMin: number, endHour: number, endMin: number): Time24[] {
  const out: Time24[] = []
  for (let m = startHour * 60 + startMin; m < endHour * 60 + endMin; m += SLOT_MINUTES) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return out
}

/** 09:00–11:45 */
export const MORNING_SLOTS: Time24[] = range(9, 0, 12, 0)
/** 12:00–16:45 */
export const AFTERNOON_SLOTS: Time24[] = range(12, 0, 17, 0)

export const ALL_SLOTS: Time24[] = [...MORNING_SLOTS, ...AFTERNOON_SLOTS]

export function isKnownSlot(time: string): time is Time24 {
  return (ALL_SLOTS as string[]).includes(time)
}
