/**
 * Serializa datos para un bloque `<script type="application/ld+json">`.
 *
 * `JSON.stringify` no escapa la secuencia `</script>`. Si un campo con texto
 * libre (p. ej. `post.title` o `post.excerpt`, que vienen de Sanity) contiene
 * literalmente `</script><script>alert(1)</script>`, cierra la etiqueta
 * JSON-LD e inyecta un script ejecutable. El fix estándar es escapar `<`
 * como `<`: JSON sigue siendo válido (es solo una secuencia de escape
 * Unicode) pero ya no puede cerrar la etiqueta que lo contiene.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
