'use client'

import { useEffect, useRef } from 'react'

/**
 * Observa todos los [data-reveal] dentro del ref y añade .is-revealed
 * cuando entran al viewport. Una sola pasada (unobserve tras revelar).
 * El escalonado se controla con style={{ '--reveal-delay': '80ms' }}.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll('[data-reveal]'))
    if (root.hasAttribute('data-reveal')) targets.unshift(root)
    if (!targets.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((t) => t.classList.add('is-revealed'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )

    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  return ref
}
