'use client'

import { useState } from 'react'
import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'

type Answers = {
  type: number
  features: number
  scale: number
  integrations: number
  urgency: number
}

type Recommendation = {
  plan: string
  price: string
  time: string
  tech: string
  match: string
}

export default function QuoteCalculator() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ type: -1, features: -1, scale: -1, integrations: -1, urgency: -1 })
  const [showResult, setShowResult] = useState(false)

  const q = t.quote

  const selectOption = (idx: number) => {
    const keys: (keyof Answers)[] = ['type', 'features', 'scale', 'integrations', 'urgency']
    setAnswers((prev) => ({ ...prev, [keys[step]]: idx }))
  }

  const next = () => {
    if (step < 4) setStep(step + 1)
    else setShowResult(true)
  }

  const back = () => {
    if (showResult) { setShowResult(false); setStep(4) }
    else if (step > 0) setStep(step - 1)
  }

  const reset = () => {
    setStep(0)
    setAnswers({ type: -1, features: -1, scale: -1, integrations: -1, urgency: -1 })
    setShowResult(false)
  }

  const getRecommendation = (): Recommendation => {
    const { type, features, scale, integrations, urgency } = answers
    let score = 0
    if (features === 3) score += 2
    if (scale >= 2) score += 2
    if (integrations >= 2) score += 1
    if (urgency <= 1) score += 1
    if (type === 2 || type === 3) score += 1

    const recs = (q.recommendations as Recommendation[])
    if (score <= 2) return recs[0]
    if (score <= 4) return recs[1]
    return recs[2]
  }

  const rec = getRecommendation()

  const currentKey: keyof Answers = ['type', 'features', 'scale', 'integrations', 'urgency'][step] as keyof Answers
  const isSelected = answers[currentKey] !== -1

  return (
    <section id="quote" ref={ref} className="py-32 px-6 max-w-2xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {q.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title">
        {q.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {q.desc}
      </p>

      <div data-reveal style={{ '--reveal-delay': '180ms' } as React.CSSProperties} className="p-8 rounded-xl card-featured">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                showResult ? 'bg-ink opacity-40' :
                i < step ? 'bg-ink opacity-40' :
                i === step ? 'bg-ink opacity-40' :
                'bg-border'
              }`}
            />
          ))}
        </div>

        {showResult ? (
          <div className="text-center py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] mb-6 opacity-50">
              {q.resultLabel}
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              {q.recommendations.map((r: Recommendation, i: number) => (
                <div
                  key={i}
                  className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                    r.plan === rec.plan
                      ? 'border-ink bg-surface/40 scale-105 shadow-card-sm'
                      : 'border-border opacity-55'
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-45 mb-1">{r.match || 'Plan'}</div>
                  <div className="text-sm font-bold text-primary font-display">{r.plan}</div>
                  <div className="text-lg font-bold text-primary tabular-nums font-display mt-1">{r.price}</div>
                  <div className="text-[10px] opacity-50 mt-0.5">{r.time}</div>
                </div>
              ))}
            </div>

            <p className="text-sm opacity-45 mb-3 leading-relaxed max-w-sm mx-auto">{q.resultDetail}</p>

            <div className="inline-flex items-center gap-2 text-xs opacity-50 mb-10">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50">{q.techSuggested || 'Tech stack'}:</span>
              <span>{rec.tech}</span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-primary px-6 py-3.5">
                {q.cta}
              </button>
              <button onClick={reset} className="btn btn-secondary px-6 py-3.5">
                {q.reset}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-semibold opacity-45 uppercase tracking-[0.1em]">
                {lang === 'es' ? `Paso ${step + 1}/5` : `Step ${step + 1}/5`}
              </span>
              <span className="text-[10px] opacity-35">—</span>
              <span className="text-[10px] opacity-35 hidden sm:inline">
                {lang === 'es' ? '2 min restantes' : '2 min remaining'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2 font-display">{q.questions[step].q}</h3>
            <p className="text-sm opacity-40 mb-8">{q.questions[step].sub}</p>

            <div className="grid sm:grid-cols-2 gap-3 mb-8" role="radiogroup" aria-label={q.questions[step].q}>
              {q.questions[step].options.map((opt, i) => {
                const selected = answers[currentKey] === i
                return (
                  <button
                    key={i}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => selectOption(i)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      selected
                        ? 'border-ink bg-surface/40'
                        : 'border-border hover:border-ink/20'
                    }`}
                  >
                    <div className="text-sm font-semibold text-primary mb-1">{opt.title}</div>
                    <div className="text-xs opacity-40">{opt.desc}</div>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between">
              <button onClick={back} disabled={step === 0} className="px-5 py-2.5 rounded-full border border-border text-sm font-medium text-primary hover:border-ink transition-colors disabled:opacity-0 disabled:pointer-events-none">
                {q.back}
              </button>
              <button onClick={next} disabled={!isSelected} className="btn btn-primary px-5 py-2.5 text-sm">
                {step === 4 ? (lang === 'es' ? 'Ver resultado' : 'See result') : q.next}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
