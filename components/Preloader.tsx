'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const LETTERS = ['E', 'X', 'T', 'R', 'O']
const BUILD_PER_LETTER = 0.15
const BLACK_DURATION = 0.15
const BUILD_TOTAL = BUILD_PER_LETTER * LETTERS.length
const PAUSE_DURATION = 0.20
const REVEAL_DURATION = 0.45
const FLIP_DURATION = 0.25
const CLEANUP_FADE = 0.15

function playTick() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2200, t0)
    osc.frequency.exponentialRampToValueAtTime(800, t0 + 0.025)
    gain.gain.setValueAtTime(0.06, t0)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.05)
    osc.onended = () => ctx.close()
  } catch { /* audio not supported */ }
}

function playWhoosh() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, t0)
    osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.55)
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(0.07, t0 + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.6)
    osc.onended = () => ctx.close()
  } catch { /* audio not supported */ }
}

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const sweepRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.removeAttribute('data-preloader')
      setVisible(false)
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: CLEANUP_FADE,
            ease: 'power3.out',
            onComplete: () => {
              document.documentElement.removeAttribute('data-preloader')
              setVisible(false)
            },
          })
        },
      })

      /* ── Phase 1: Black screen ── */
      tl.to({}, { duration: BLACK_DURATION })

      /* ── Perspective / depth on text ── */
      const textEl = textRef.current
      if (textEl) {
        tl.fromTo(
          textEl,
          { rotateX: 0.8, transformOrigin: 'center center 0px' },
          { rotateX: 0, duration: BUILD_TOTAL, ease: 'power3.out' },
          BLACK_DURATION
        )
      }

      /* ── Phase 2: Build EXTRO ── */
      LETTERS.forEach((_, i) => {
        const el = letterRefs.current[i]
        if (!el) return

        const start = BLACK_DURATION + i * BUILD_PER_LETTER

        tl.fromTo(
          el,
          {
            clipPath: 'inset(100% 0 0 0)',
            opacity: 0,
            filter: 'blur(12px)',
            scaleY: 0.7,
            y: 18,
          },
          {
            clipPath: 'inset(0% 0 0 0)',
            opacity: 1,
            filter: 'blur(0px)',
            scaleY: 1,
            y: 0,
            duration: 0.12,
            ease: 'power3.out',
          },
          start
        )

        /* tick on each letter */
        tl.call(() => playTick(), [], start + 0.12)
      })

      /* Particles when last letter completes */
      tl.call(() => {
        const particlesContainer = particlesRef.current
        const lastLetter = letterRefs.current[4]
        if (!particlesContainer || !lastLetter) return

        const rect = lastLetter.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        const particles: HTMLDivElement[] = []
        for (let i = 0; i < 22; i++) {
          const dot = document.createElement('div')
          dot.className = 'preloader__particle'
          dot.style.left = `${cx}px`
          dot.style.top = `${cy}px`
          dot.style.width = `${1.5 + Math.random() * 2}px`
          dot.style.height = dot.style.width
          particlesContainer.appendChild(dot)
          particles.push(dot)
        }

        particles.forEach((dot) => {
          const angle = Math.random() * Math.PI * 2
          const dist = 30 + Math.random() * 60
          gsap.fromTo(
            dot,
            { opacity: 0, x: 0, y: 0 },
            {
              opacity: 0.7,
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              duration: 0.15,
              ease: 'power3.out',
              onComplete: () => {
                gsap.to(dot, {
                  opacity: 0,
                  duration: 0.12,
                  ease: 'power2.in',
                  onComplete: () => dot.remove(),
                })
              },
            }
          )
        })
      }, [], BLACK_DURATION + BUILD_TOTAL)

      /* Light sweep across fully built EXTRO */
      tl.to(
        sweepRef.current,
        {
          opacity: 1,
          duration: 0.01,
        },
        BLACK_DURATION + BUILD_TOTAL
      )
      tl.fromTo(
        sweepRef.current,
        { left: '-100%' },
        {
          left: '100%',
          duration: 0.28,
          ease: 'power2.inOut',
        },
        BLACK_DURATION + BUILD_TOTAL + 0.02
      )
      tl.to(
        sweepRef.current,
        { opacity: 0, duration: 0.08 },
        BLACK_DURATION + BUILD_TOTAL + 0.30
      )

      /* ── Phase 3: Pause ── */
      tl.to({}, { duration: PAUSE_DURATION })

      /* ── Phase 4: Circle reveal ── */
      tl.addLabel('revealStart')

      /* Whoosh sound */
      tl.call(() => playWhoosh(), [], 'revealStart')

      /* Release hero animations and trigger lens effect */
      tl.call(() => {
        document.documentElement.removeAttribute('data-preloader')
      }, [], 'revealStart')

      /* Circle contracts toward the 'O' letter center */
      const maskProxy = { r: 100 }
      tl.call(() => {
        const lastLetter = letterRefs.current[4]
        if (lastLetter && maskRef.current) {
          const oRect = lastLetter.getBoundingClientRect()
          const oCx = oRect.left + oRect.width / 2
          const oCy = oRect.top + oRect.height / 2
          const updateMask = () => {
            if (maskRef.current) {
              maskRef.current.style.clipPath = `circle(${maskProxy.r}% at ${oCx}px ${oCy}px)`
            }
          }
          updateMask()
            ;(maskProxy as any).__updateMask = updateMask
        }
      }, [], 'revealStart')

      /* Phase 1 of reveal: rapid contraction */
      tl.to(
        maskProxy,
        {
          r: 0,
          duration: REVEAL_DURATION * 0.78,
          ease: 'power3.in',
          onUpdate: () => {
            const proxy = maskProxy as any
            if (maskRef.current && proxy.__updateMask) {
              proxy.__updateMask()
            }
          },
        },
        'revealStart'
      )

      /* Phase 2 of reveal: micro overshoot */
      tl.to(
        maskProxy,
        {
          r: 0.8,
          duration: REVEAL_DURATION * 0.12,
          ease: 'power2.out',
          onUpdate: () => {
            const proxy = maskProxy as any
            if (maskRef.current && proxy.__updateMask) {
              proxy.__updateMask()
            }
          },
        }
      )

      /* Phase 3 of reveal: settle */
      tl.to(
        maskProxy,
        {
          r: 0,
          duration: REVEAL_DURATION * 0.10,
          ease: 'power4.in',
          onUpdate: () => {
            const proxy = maskProxy as any
            if (maskRef.current && proxy.__updateMask) {
              proxy.__updateMask()
            }
          },
        }
      )

      /* ── Phase 5: FLIP transition ── */
      tl.call(() => {
        const preloaderText = textRef.current
        const heroH1 = document.querySelector('#hero h1') as HTMLElement | null

        if (!preloaderText || !heroH1) return

        const from = preloaderText.getBoundingClientRect()
        const to = heroH1.getBoundingClientRect()

        const fromCx = from.left + from.width / 2
        const fromCy = from.top + from.height / 2
        const toCx = to.left + to.width / 2
        const toCy = to.top + to.height / 2

        const dx = toCx - fromCx
        const dy = toCy - fromCy
        const sx = to.width / from.width
        const sy = to.height / from.height

        gsap.set(preloaderText, { transformOrigin: 'center center' })
        gsap.fromTo(
          preloaderText,
          { filter: 'blur(0px)' },
          {
            x: dx,
            y: dy,
            scaleX: sx,
            scaleY: sy,
            opacity: 0,
            filter: 'blur(8px)',
            duration: FLIP_DURATION,
            ease: 'power3.inOut',
            keyframes: [
              { filter: 'blur(0px)' },
              { filter: 'blur(5px)' },
              { filter: 'blur(0px)' },
            ],
          }
        )
        gsap.to(heroH1, {
          opacity: 1,
          duration: FLIP_DURATION,
          ease: 'power3.out',
        })
      }, [], '-=0.04')

    }, containerRef)

    return () => ctx.revert()
  }, [])

  if (!visible) return null

  return (
    <div ref={containerRef} className="preloader">
      {/* Noise grain layer */}
      <div className="preloader__noise" />

      {/* Organic circle mask */}
      <div ref={maskRef} className="preloader__mask preloader__mask--organic" />

      {/* Particles container */}
      <div ref={particlesRef} className="preloader__particles" />

      {/* EXTRO building text */}
      <div ref={textRef} className="preloader__text">
        {/* Light sweep reflection */}
        <div ref={sweepRef} className="preloader__sweep" />

        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={(el) => { letterRefs.current[i] = el }}
            className="preloader__letter"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  )
}
