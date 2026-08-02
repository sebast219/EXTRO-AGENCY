import { gsap } from 'gsap'

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#01233456789'

export function randomText(len: number): string {
  let out = ''
  for (let i = 0; i < len; i++) {
    out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
  }
  return out
}

// Divide un título en palabras wrappeadas en spans con data-text
export function wrapWords(titleEl: HTMLElement, text: string) {
  titleEl.textContent = ''
  const words = text.split(' ')
  const frag = document.createDocumentFragment()
  words.forEach((word, i) => {
    const span = document.createElement('span')
    span.dataset.text = word
    span.textContent = word
    span.style.display = 'inline-block'
    span.style.willChange = 'contents'
    span.style.marginRight = '0.24em'
    frag.appendChild(span)
    if (i < words.length - 1) frag.appendChild(document.createTextNode(' '))
  })
  titleEl.appendChild(frag)
  return Array.from(titleEl.querySelectorAll<HTMLSpanElement>('span[data-text]'))
}

// Anima una palabra con efecto scramble: caracteres aleatorios -> texto final
export function scrambleWord(wordEl: HTMLElement, duration: number, onTick?: () => void) {
  const original = wordEl.dataset.text || wordEl.textContent || ''
  const state = { progress: 0 }
  let lastTick = 0

  return gsap.to(state, {
    progress: 1,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      if (state.progress < 0.88) {
        wordEl.textContent = randomText(original.length)
        if (onTick) {
          const now = performance.now()
          if (now - lastTick > 34) {
            lastTick = now
            onTick()
          }
        }
      } else {
        wordEl.textContent = original
      }
    },
  })
}
