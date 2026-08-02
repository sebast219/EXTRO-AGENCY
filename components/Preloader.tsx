'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { randomText } from '@/lib/scramble'
import { playTypingClick } from '@/lib/sound'

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = rootRef.current
    if (prefersReduced || !root) {
      root?.remove()
      return
    }

    const scrambleEl = root.querySelector<HTMLElement>('.preloader__scramble')
    const brandEl = root.querySelector<HTMLElement>('.preloader__brand')
    const fillEl = root.querySelector<HTMLElement>('.preloader__bar-fill')
    const percentEl = root.querySelector<HTMLElement>('.preloader__percent')

    const target = 'EX·TRON'
    const state = { progress: 0 }
    let typingAt = 0

    // Bloquear scroll durante el preloader (tras la hidratación para evitar el warning de atributos)
    const lockTimer = window.setTimeout(() => {
      document.body.style.overflow = 'hidden'
    }, 0)

    const finish = () => {
      document.body.style.overflow = ''
      root.remove()
    }

    // Failsafe: si algo falla, nunca dejar la página bloqueada
    const failsafe = window.setTimeout(() => {
      document.body.style.overflow = ''
      root.style.opacity = '0'
      window.setTimeout(() => root.remove(), 400)
    }, 5000)

    gsap.config({ autoSleep: 60, force3D: true, nullTargetWarn: false })
    gsap.ticker.lagSmoothing(500, 33)

    const tl = gsap.timeline({ onComplete: finish })
    tl.to(state, {
      progress: 1,
      duration: 1.15,
      ease: 'none',
      onUpdate: () => {
        if (scrambleEl) {
          const revealCount = Math.floor(state.progress * target.length)
          let output = ''
          for (let i = 0; i < target.length; i++) {
            output += i < revealCount ? target[i] : randomText(1)
          }
          scrambleEl.textContent = output
        }
        if (fillEl) fillEl.style.width = `${state.progress * 100}%`
        if (percentEl) percentEl.textContent = `${Math.round(state.progress * 100)}%`
        const now = performance.now()
        if (now - typingAt > 34) {
          typingAt = now
          playTypingClick()
        }
      },
    })
      .to(scrambleEl, { opacity: 0, duration: 0.2 }, '-=0.1')
      .to(brandEl, { opacity: 1, duration: 0.28 }, '<')
      .to(root, { opacity: 0, duration: 0.38, delay: 0.16, onComplete: () => window.clearTimeout(failsafe) })

    return () => {
      window.clearTimeout(failsafe)
      window.clearTimeout(lockTimer)
      document.body.style.overflow = ''
    }  }, [])

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <span className="preloader__scramble" />
      <span className="preloader__brand">EX·TRON</span>
      <div className="preloader__bar">
        <div className="preloader__bar-fill" />
      </div>
      <span className="preloader__percent">0%</span>
    </div>
  )
}
