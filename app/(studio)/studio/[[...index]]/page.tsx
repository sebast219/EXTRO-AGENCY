import { notFound } from 'next/navigation'
import { isSanityConfigured } from '@/lib/content/posts'
import Studio from './Studio'

/**
 * `force-dynamic`: el proxy (`proxy.ts`) genera un nonce nuevo por petición
 * para el header CSP (`script-src ... 'nonce-X' 'strict-dynamic'`). Si esta
 * página fuera estática, el HTML se generaría una sola vez en build con un
 * nonce que nunca coincidiría con el del header en producción, y el
 * navegador bloquearía todo el bundle de Sanity Studio (~40 chunks JS) por
 * CSP. Renderizar en cada petición asegura que el nonce del HTML siempre
 * coincida con el del header, igual que ya hacen las páginas de `(site)`.
 */
export const dynamic = 'force-dynamic'

export default function StudioPage() {
  // Sanity not configured: answer 404 instead of exposing env variable names.
  if (!isSanityConfigured) notFound()
  return <Studio />
}
