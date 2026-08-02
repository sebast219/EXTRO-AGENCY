'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const COLORS = ['#cef00a', '#506ffd', '#000000']

export default function HeroParticles() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    const lowCpuDevice = (navigator.hardwareConcurrency || 8) <= 4
    const navAny = navigator as Navigator & { deviceMemory?: number }
    const lowMemoryDevice = (navAny.deviceMemory || 8) <= 4
    const useLiteMode = lowCpuDevice || lowMemoryDevice || prefersCoarsePointer

    if (prefersReduced) return

    const count = useLiteMode ? 16 : 30
    const tweens: gsap.core.Tween[] = []

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      p.className = 'hero-particle'
      const size = 3 + Math.random() * 6
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]
      p.style.left = `${Math.random() * 100}%`
      p.style.top = `${10 + Math.random() * 80}%`
      p.style.opacity = String(0.25 + Math.random() * 0.45)
      root.appendChild(p)

      const duration = 4 + Math.random() * 6
      tweens.push(
        gsap.to(p, {
          x: () => gsap.utils.random(-160, 160),
          y: () => gsap.utils.random(-120, 120),
          duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
        })
      )
    }

    // Pausa durante scroll con 140ms de debounce
    let scrollTimer: number | null = null
    const onScroll = () => {
      if (scrollTimer) window.clearTimeout(scrollTimer)
      gsap.globalTimeline.pause()
      scrollTimer = window.setTimeout(() => gsap.globalTimeline.resume(), 140)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollTimer) window.clearTimeout(scrollTimer)
      tweens.forEach((t) => t.kill())
      root.replaceChildren()
    }
  }, [])

  return <div ref={rootRef} className="hero-particles" aria-hidden="true" />
}
