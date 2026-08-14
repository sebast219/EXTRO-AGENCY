import { describe, it, expect } from 'vitest'
import { computeAvailability, isBookable, fomoFromEnv, DEFAULT_FOMO } from './availability'
import { ALL_SLOTS, MIN_LEAD_MINUTES } from './slots'
import { zonedToUtc, todayISO, to12h, addDaysISO, formatDateLong } from './time'

const TZ = 'America/Bogota'

/** Un instante fijo para que las pruebas no dependan del reloj. */
const NOW = new Date('2026-08-11T14:00:00Z') // 09:00 en Bogotá
const TOMORROW = '2026-08-12'

const noFomo = { ...DEFAULT_FOMO, ratio: 0 }

describe('zonedToUtc', () => {
  it('convierte una hora de pared de Bogotá al instante UTC correcto', () => {
    // Bogotá es UTC-5 todo el año.
    expect(zonedToUtc('2026-08-12', '09:00', TZ).toISOString()).toBe('2026-08-12T14:00:00.000Z')
  })

  it('no desplaza el día al formatear (regresión de M-9)', () => {
    // El fallo original: new Date('2026-08-12T00:00:00') en un servidor UTC
    // devolvía el día anterior para un usuario en Bogotá.
    expect(formatDateLong('2026-08-12', 'es', TZ)).toContain('12')
  })
})

describe('to12h', () => {
  it.each([
    ['09:00', '9:00 AM'],
    ['12:00', '12:00 PM'],
    ['13:45', '1:45 PM'],
    ['00:30', '12:30 AM'],
  ])('%s -> %s', (input, expected) => {
    expect(to12h(input)).toBe(expected)
  })
})

describe('computeAvailability', () => {
  it('sin ocupación real y sin FOMO, todos los huecos quedan libres', () => {
    const r = computeAvailability({ date: TOMORROW, timeZone: TZ, busy: [], now: NOW, fomo: noFomo })
    expect(r.free).toHaveLength(ALL_SLOTS.length)
    expect(r.taken).toHaveLength(0)
  })

  it('marca como ocupado el hueco que solapa con un evento real', () => {
    const busy = [
      {
        start: zonedToUtc(TOMORROW, '10:00', TZ),
        end: zonedToUtc(TOMORROW, '10:30', TZ),
      },
    ]
    const r = computeAvailability({ date: TOMORROW, timeZone: TZ, busy, now: NOW, fomo: noFomo })

    expect(r.breakdown.booked).toContain('10:00')
    expect(r.breakdown.booked).toContain('10:15')
    expect(r.free).not.toContain('10:00')
    expect(r.free).toContain('10:30') // el final del intervalo no solapa
  })

  it('excluye los huecos dentro del margen mínimo de antelación', () => {
    const today = todayISO(TZ, NOW)
    const r = computeAvailability({ date: today, timeZone: TZ, busy: [], now: NOW, fomo: noFomo })

    // Son las 09:00 en Bogotá con 60 min de margen: 09:00 y 09:45 no valen.
    expect(r.breakdown.past).toContain('09:00')
    expect(r.breakdown.past).toContain('09:45')
    expect(r.free).toContain('10:00')
  })

  it('la capa de escasez nunca deja menos huecos libres que minFree', () => {
    const fomo = { ratio: 0.6, minFree: 6, salt: 'test' }
    const r = computeAvailability({ date: TOMORROW, timeZone: TZ, busy: [], now: NOW, fomo })
    expect(r.free.length).toBeGreaterThanOrEqual(fomo.minFree)
  })

  it('la capa de escasez es determinista para una misma fecha', () => {
    const args = { date: TOMORROW, timeZone: TZ, busy: [], now: NOW, fomo: DEFAULT_FOMO }
    const a = computeAvailability(args)
    const b = computeAvailability(args)
    expect(a.taken).toEqual(b.taken)
  })

  it('la escasez no puede desocupar un hueco realmente reservado', () => {
    const busy = [{ start: zonedToUtc(TOMORROW, '11:00', TZ), end: zonedToUtc(TOMORROW, '11:15', TZ) }]
    const r = computeAvailability({
      date: TOMORROW,
      timeZone: TZ,
      busy,
      now: NOW,
      fomo: { ratio: 0.6, minFree: 1, salt: 'test' },
    })
    expect(r.free).not.toContain('11:00')
  })

  it('no revela qué huecos son simulados en la lista pública', () => {
    const r = computeAvailability({ date: TOMORROW, timeZone: TZ, busy: [], now: NOW })
    // `taken` es una lista plana; el desglose queda solo en breakdown.
    for (const slot of r.breakdown.simulated) expect(r.taken).toContain(slot)
  })
})

describe('fomoFromEnv', () => {
  it('sin variable usa el valor por defecto', () => {
    expect(fomoFromEnv(undefined).ratio).toBe(DEFAULT_FOMO.ratio)
  })

  it('"0" desactiva la capa por completo', () => {
    expect(fomoFromEnv('0').ratio).toBe(0)
  })

  it('acota la proporción máxima', () => {
    expect(fomoFromEnv('0.99').ratio).toBeLessThanOrEqual(0.6)
  })
})

describe('isBookable', () => {
  it('acepta un hueco libre en el futuro', () => {
    expect(isBookable(TOMORROW, '10:00', { timeZone: TZ, busy: [], now: NOW })).toEqual({ ok: true })
  })

  it('rechaza una hora que no es un hueco conocido', () => {
    expect(isBookable(TOMORROW, '10:07', { timeZone: TZ, busy: [], now: NOW })).toEqual({
      ok: false,
      reason: 'unknown-slot',
    })
  })

  it('rechaza un hueco ya ocupado', () => {
    const busy = [{ start: zonedToUtc(TOMORROW, '10:00', TZ), end: zonedToUtc(TOMORROW, '10:15', TZ) }]
    expect(isBookable(TOMORROW, '10:00', { timeZone: TZ, busy, now: NOW })).toEqual({
      ok: false,
      reason: 'busy',
    })
  })

  it('rechaza una fecha pasada', () => {
    expect(isBookable('2026-08-01', '10:00', { timeZone: TZ, busy: [], now: NOW })).toEqual({
      ok: false,
      reason: 'past',
    })
  })

  it('acepta un hueco que la capa de escasez ocultaba', () => {
    // Regla explícita: no perder un cliente real por un adorno de marketing.
    const r = computeAvailability({
      date: TOMORROW,
      timeZone: TZ,
      busy: [],
      now: NOW,
      fomo: { ratio: 0.5, minFree: 1, salt: 'test' },
    })
    const hidden = r.breakdown.simulated[0]
    expect(hidden).toBeDefined()
    expect(isBookable(TOMORROW, hidden, { timeZone: TZ, busy: [], now: NOW })).toEqual({ ok: true })
  })

  it('respeta el margen mínimo de antelación', () => {
    const soon = new Date(NOW.getTime() + (MIN_LEAD_MINUTES - 10) * 60_000)
    const today = todayISO(TZ, NOW)
    const slot = ALL_SLOTS.find((s) => zonedToUtc(today, s, TZ) > NOW && zonedToUtc(today, s, TZ) < soon)
    if (!slot) return
    expect(isBookable(today, slot, { timeZone: TZ, busy: [], now: NOW }).ok).toBe(false)
  })
})

describe('addDaysISO', () => {
  it('cruza el fin de mes sin desfase', () => {
    expect(addDaysISO('2026-08-31', 1)).toBe('2026-09-01')
    expect(addDaysISO('2026-01-01', -1)).toBe('2025-12-31')
  })
})
