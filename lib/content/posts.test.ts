import { describe, it, expect } from 'vitest'
import { extractSlugFromWebhookPayload } from './posts'

/**
 * El webhook de Sanity puede configurarse (vía GROQ projection en sanity.io)
 * para mandar distintas formas de payload. Estos casos cubren las formas
 * documentadas más comunes y los payloads inválidos/ausentes, para que
 * `/api/revalidate` invalide el tag `post:<slug>` cuando el slug viene, sin
 * asumir una forma fija.
 */
describe('extractSlugFromWebhookPayload', () => {
  it('extrae el slug cuando viene como objeto { current }', () => {
    expect(extractSlugFromWebhookPayload({ slug: { current: 'mi-articulo' } })).toBe(
      'mi-articulo'
    )
  })

  it('extrae el slug cuando viene como string plano', () => {
    expect(extractSlugFromWebhookPayload({ slug: 'mi-articulo' })).toBe('mi-articulo')
  })

  it('devuelve null si el payload es null', () => {
    expect(extractSlugFromWebhookPayload(null)).toBeNull()
  })

  it('devuelve null si el payload no es un objeto', () => {
    expect(extractSlugFromWebhookPayload('mi-articulo')).toBeNull()
  })

  it('devuelve null si falta el slug', () => {
    expect(extractSlugFromWebhookPayload({ _type: 'post' })).toBeNull()
  })

  it('devuelve null si slug.current no es un string', () => {
    expect(extractSlugFromWebhookPayload({ slug: { current: 42 } })).toBeNull()
  })

  it('devuelve null si el slug plano está vacío', () => {
    expect(extractSlugFromWebhookPayload({ slug: '' })).toBeNull()
  })
})
