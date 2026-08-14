'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './motion'

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll('[data-reveal]'))
    if (root.hasAttribute('data-reveal')) targets.unshift(root)
    if (!targets.length) return

    if (prefersReducedMotion()) {
      targets.forEach((t) => t.classList.add('is-revealed'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const delay = target.style.getPropertyValue('--reveal-delay') || '0ms'
            setTimeout(() => {
              target.classList.add('is-revealed')
            }, parseInt(delay))
            io.unobserve(target)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
    )

    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  return ref
}
