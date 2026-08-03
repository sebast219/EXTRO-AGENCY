'use client'

import { useEffect, useRef } from 'react'

export default function AmbientGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let raf: number

    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const maxScroll = document.body.scrollHeight - window.innerHeight
        const pct = maxScroll > 0 ? scrollY / maxScroll : 0
        // Subtle drift: grid slightly shifts and deforms as you scroll
        grid.style.transform = `translateY(${-scrollY * 0.03}px) scaleY(${1 + pct * 0.02})`
        grid.style.opacity = String(0.15 + pct * 0.1)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={gridRef} className="ambient-grid" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="ambient-grid__col" />
      ))}
    </div>
  )
}
