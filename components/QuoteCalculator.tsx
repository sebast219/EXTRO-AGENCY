'use client'

import { useState } from 'react'
import { useLang } from './LanguageProvider'

type Answers = {
  type: number
  complexity: number
  integrations: number
  urgency: number
}

const basePrices = {
  type: [2000000, 5000000, 3000000, 8000000],
  complexity: [1, 1.5, 2.5, 4],
  integrations: [1, 1.3, 1.8, 2.5],
  urgency: [0.9, 1, 1.4, 1.8],
}

const timeLabels: Record<string, string[]> = {
  es: ['2-3 meses', '1-2 meses', '2-4 semanas', '1-2 semanas'],
  en: ['2-3 months', '1-2 months', '2-4 weeks', '1-2 weeks'],
}

export default function QuoteCalculator() {
  const { lang, t } = useLang()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ type: -1, complexity: -1, integrations: -1, urgency: -1 })
  const [showResult, setShowResult] = useState(false)

  const q = t.quote

  const selectOption = (idx: number) => {
    const keys: (keyof Answers)[] = ['type', 'complexity', 'integrations', 'urgency']
    setAnswers(prev => ({ ...prev, [keys[step]]: idx }))
  }

  const next = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      setShowResult(true)
    }
  }

  const back = () => {
    if (showResult) {
      setShowResult(false)
      setStep(3)
    } else if (step > 0) {
      setStep(step - 1)
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers({ type: -1, complexity: -1, integrations: -1, urgency: -1 })
    setShowResult(false)
  }

  const calculate = () => {
    const base = basePrices.type[answers.type]
    const comp = basePrices.complexity[answers.complexity]
    const int = basePrices.integrations[answers.integrations]
    const urg = basePrices.urgency[answers.urgency]
    const total = Math.round(base * comp * int * urg)
    return new Intl.NumberFormat(lang === 'es' ? 'es-CO' : 'en-US', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(total)
  }

  const currentKey: keyof Answers = ['type', 'complexity', 'integrations', 'urgency'][step] as keyof Answers
  const isSelected = answers[currentKey] !== -1

  return (
    <section id="quote" className="py-20 px-6 max-w-3xl mx-auto scroll-mt-20">
      <div className="section-label">{q.label}</div>
      <h2 className="section-title">{q.title}</h2>
      <p className="section-desc">{q.desc}</p>

      <div className="mt-10 p-8 border border-border rounded-xl bg-surface-raised">
        <div className="h-1 bg-border rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lime to-brand-blue transition-all duration-500"
            style={{ width: showResult ? '100%' : `${((step + 1) / 4) * 100}%` }}
          />
        </div>

        {showResult ? (
          <div className="text-center py-8">
            <div className="text-xs text-tertiary uppercase tracking-[0.15em] mb-4">{q.resultLabel}</div>
            <div className="text-4xl md:text-5xl font-medium text-primary tabular-nums mb-4">
              {calculate()}
            </div>
            <p className="text-sm text-secondary mb-2">{q.resultDetail}</p>
            <p className="text-sm text-secondary mb-8">
              {lang === 'es' ? 'Tiempo estimado: ' : 'Estimated time: '}
              <span className="text-primary font-medium">
                {timeLabels[lang][answers.urgency]}
              </span>
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  const el = document.getElementById('contact')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn btn-primary px-6 py-3"
              >
                {q.cta}
              </button>
              <button
                onClick={reset}
                className="btn btn-secondary px-6 py-3"
              >
                {q.reset}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-medium text-primary mb-1">{q.questions[step].q}</h3>
            <p className="text-sm text-tertiary mb-6">{q.questions[step].sub}</p>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {q.questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    answers[currentKey] === i
                      ? 'border-primary bg-primary/[0.03]'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-[15px] font-medium text-primary mb-1">{opt.title}</div>
                  <div className="text-xs text-tertiary">{opt.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={back}
                className={`px-5 py-2.5 border border-border rounded-lg text-sm text-primary hover:bg-surface transition-colors ${
                  step === 0 ? 'invisible' : ''
                }`}
              >
                {q.back}
              </button>
              <button
                onClick={next}
                disabled={!isSelected}
                className="btn btn-primary px-5 py-2.5"
              >
                {step === 3 ? (lang === 'es' ? 'Calcular' : 'Calculate') : q.next}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
