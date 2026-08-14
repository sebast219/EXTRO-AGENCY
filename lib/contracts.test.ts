import { describe, it, expect } from 'vitest'
import { contactSchema, bookingSchema, MAX_BODY_BYTES, PROJECT_LABELS } from './contracts'

/**
 * A-9: antes cada ruta validaba a mano y las reglas ya habían divergido —
 * contacto exigía 10 caracteres de mensaje, reserva no acotaba `notes` en
 * absoluto. Estos casos fijan el contrato.
 */

const validContact = {
  name: 'Sebastián Yepes',
  email: 'Sebastian@Example.COM',
  project: 'web',
  message: 'Quiero construir una tienda con pagos e inventario.',
}

describe('contactSchema', () => {
  it('acepta una entrada válida', () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true)
  })

  it('normaliza el email a minúsculas', () => {
    const parsed = contactSchema.parse(validContact)
    expect(parsed.email).toBe('sebastian@example.com')
  })

  it('aplica el idioma por defecto', () => {
    expect(contactSchema.parse(validContact).locale).toBe('es')
  })

  it('rechaza un tipo de proyecto desconocido', () => {
    const r = contactSchema.safeParse({ ...validContact, project: 'blockchain' })
    expect(r.success).toBe(false)
  })

  it('rechaza un mensaje demasiado corto', () => {
    expect(contactSchema.safeParse({ ...validContact, message: 'hola' }).success).toBe(false)
  })

  it('acota la longitud del mensaje', () => {
    const r = contactSchema.safeParse({ ...validContact, message: 'x'.repeat(2001) })
    expect(r.success).toBe(false)
  })

  it('recorta los espacios del nombre', () => {
    expect(contactSchema.parse({ ...validContact, name: '  Ana  ' }).name).toBe('Ana')
  })

  it('todo tipo de proyecto tiene etiqueta en ambos idiomas', () => {
    for (const [, labels] of Object.entries(PROJECT_LABELS)) {
      expect(labels.es.length).toBeGreaterThan(0)
      expect(labels.en.length).toBeGreaterThan(0)
    }
  })
})

const validBooking = {
  name: 'Ana López',
  email: 'ana@example.com',
  date: '2026-09-15',
  time: '10:30',
}

describe('bookingSchema', () => {
  it('acepta una entrada válida', () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true)
  })

  it('las notas son opcionales y por defecto vacías', () => {
    expect(bookingSchema.parse(validBooking).notes).toBe('')
  })

  it('acota las notas — antes no tenían ningún límite', () => {
    const r = bookingSchema.safeParse({ ...validBooking, notes: 'x'.repeat(1001) })
    expect(r.success).toBe(false)
  })

  it('rechaza una hora fuera de la rejilla de 15 minutos', () => {
    expect(bookingSchema.safeParse({ ...validBooking, time: '10:07' }).success).toBe(false)
  })

  it('rechaza una hora fuera del horario de atención', () => {
    expect(bookingSchema.safeParse({ ...validBooking, time: '22:00' }).success).toBe(false)
  })

  it('rechaza formatos de fecha que no sean ISO', () => {
    for (const date of ['15/09/2026', '2026-9-15', 'mañana']) {
      expect(bookingSchema.safeParse({ ...validBooking, date }).success).toBe(false)
    }
  })

  it('rechaza un email inválido', () => {
    expect(bookingSchema.safeParse({ ...validBooking, email: 'no-es-email' }).success).toBe(false)
  })

  it('el campo trampa debe venir vacío', () => {
    expect(bookingSchema.safeParse({ ...validBooking, website: '' }).success).toBe(true)
    expect(bookingSchema.safeParse({ ...validBooking, website: 'spam' }).success).toBe(false)
  })
})

describe('límite de cuerpo', () => {
  it('es lo bastante pequeño para que un mensaje válido nunca lo alcance', () => {
    const biggest = JSON.stringify({ ...validContact, message: 'x'.repeat(2000) })
    expect(biggest.length).toBeLessThan(MAX_BODY_BYTES)
  })
})
