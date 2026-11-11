'use client'

import { useEffect } from 'react'

/**
 * Arranca la capa de movimiento de la home (GSAP + Motion + Lenis) y la limpia al desmontar.
 * Se importa en diferido: las librerías de animación salen del bundle inicial y se descargan en
 * un chunk aparte justo después de hidratar. No se espera a "idle" porque la animación de entrada
 * del hero empieza ahí y un retraso dejaría ver el contenido un instante antes de animarse.
 */
export default function HomeFx() {
  useEffect(() => {
    let stop: (() => void) | undefined
    let cancelled = false

    void import('./home-fx').then((m) => {
      if (!cancelled) stop = m.startHomeFx()
    })

    return () => {
      cancelled = true
      stop?.()
    }
  }, [])
  return null
}
