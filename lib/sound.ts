import { prefersReducedMotion } from './motion'

let ctx: AudioContext | null = null
let unlocked = false

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (typeof AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') return null
  if (!ctx) {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
    ctx = new AC()
  }
  return ctx
}

export function unlockAudio() {
  const c = getAudioContext()
  if (!c || unlocked) return
  if (c.state === 'suspended') void c.resume()
  unlocked = true
}

// Sonido de hover: oscilador triangle 780 -> 1180 Hz (pixelee).
// Solo suena después de que el usuario interactúa (política de autoplay).
export function playHoverSound() {
  if (prefersReducedMotion()) return
  const c = getAudioContext()
  if (!c || c.state !== 'running') return

  const t0 = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(780, t0)
  osc.frequency.exponentialRampToValueAtTime(1180, t0 + 0.055)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(0.045, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + 0.1)
}

// Adjunta sonido de hover a un elemento (link de navegación)
export function attachHoverSound(el: HTMLElement | null) {
  if (!el) return
  const handler = () => playHoverSound()
  el.addEventListener('mouseenter', handler)
  return () => el.removeEventListener('mouseenter', handler)
}
