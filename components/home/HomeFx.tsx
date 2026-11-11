'use client'

import { useEffect } from 'react'
import { startHomeFx } from './home-fx'

/** Arranca la capa de movimiento de la home (GSAP + Motion + Lenis) y la limpia al desmontar. */
export default function HomeFx() {
  useEffect(() => startHomeFx(), [])
  return null
}
