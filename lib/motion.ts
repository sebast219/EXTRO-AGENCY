/**
 * B-10: `prefers-reduced-motion` se consultaba en cinco sitios con cuatro
 * variantes distintas, y en Hero.tsx dos veces seguidas en el mismo efecto.
 * Una sola función, un solo criterio.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true // en servidor, no animar
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Comportamiento de scroll que respeta la preferencia del sistema. */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth'
}

/** Desplaza a un elemento por id, respetando la preferencia. */
export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: scrollBehavior() })
}
