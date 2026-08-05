'use client'

import { useState, useMemo } from 'react'
import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { Mail, MapPin, Wifi, Calendar, Clock, ChevronLeft, ChevronRight, Check, ArrowLeft, Loader2, Video, Zap } from 'lucide-react'
import { siWhatsapp } from 'simple-icons'

const MORNING_SLOTS = [
  '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
]

const AFTERNOON_SLOTS = [
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM',
  '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
  '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
  '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
]

type Step = 'calendar' | 'slots' | 'form' | 'sending' | 'success'

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = firstDay.getDay()
  const totalDays = lastDay.getDate()
  const days: (number | null)[] = []

  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= totalDays; d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)

  return days
}

function formatDate(date: Date, months: string[]) {
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${months[date.getMonth()]} ${day}, ${year}`
}

function hashStr(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

function isSlotTaken(dateStr: string, slot: string): boolean {
  return hashStr(dateStr + slot) % 4 < 1
}

function SlotGroup({ label, slots, selected, onSelect, taken }: { label: string; slots: string[]; selected: string; onSelect: (s: string) => void; taken: Set<string> }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-35 mb-2.5">{label}</p>
      <div className="grid grid-cols-4 gap-1.5">
        {slots.map((slot) => {
          const isTaken = taken.has(slot)
          return (
            <button
              key={slot}
              onClick={() => !isTaken && onSelect(slot)}
              disabled={isTaken}
              className={`text-xs py-2.5 px-2 rounded-lg font-medium transition-all duration-150 relative ${
                isTaken
                  ? 'opacity-25 line-through cursor-not-allowed bg-surface/30'
                  : selected === slot
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-surface/50 text-primary hover:bg-ink/8 hover:text-ink'
              }`}
            >
              {slot}
              {isTaken && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Contact() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>()
  const cal = t.contact.calendar

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [step, setStep] = useState<Step>('calendar')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const monthDays = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth])
  const viewMonthLabel = `${cal.months[viewMonth]} ${viewYear}`

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const selectedStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : ''

  const isPast = (d: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return dateStr < todayStr
  }

  const takenSlots = useMemo(() => {
    if (!selectedDate) return new Set<string>()
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    const set = new Set<string>()
    for (const slot of [...MORNING_SLOTS, ...AFTERNOON_SLOTS]) {
      if (isSlotTaken(dateStr, slot)) set.add(slot)
    }
    return set
  }, [selectedDate])

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  const selectDate = (d: number) => {
    if (isPast(d)) return
    setSelectedDate(new Date(viewYear, viewMonth, d))
    setStep('slots')
  }

  const selectSlot = (slot: string) => {
    setSelectedSlot(slot)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStep('sending')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          date: selectedDate ? formatDate(selectedDate, cal.months) : '',
          time: selectedSlot,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error')
      setStep('success')
    } catch {
      setError(lang === 'es' ? 'No se pudo agendar. Intenta de nuevo.' : 'Could not book. Try again.')
      setStep('form')
    }
  }

  return (
    <section id="contact" ref={ref} className="py-32 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div data-reveal className="section-label">
        {t.contact.label}
      </div>
      <h2 data-reveal style={{ '--reveal-delay': '60ms' } as React.CSSProperties} className="section-title max-w-xl">
        {t.contact.title}
      </h2>
      <p data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} className="section-desc mb-14">
        {t.contact.desc}
      </p>

      <div className="grid md:grid-cols-[1fr_320px] gap-10 items-start">
        <div data-reveal style={{ '--reveal-delay': '180ms' } as React.CSSProperties} className="card overflow-hidden rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border bg-surface/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Video size={14} strokeWidth={1.5} className="opacity-55" />
                  <span className="text-sm font-semibold text-primary font-display">{cal.title}</span>
                </div>
                <p className="text-xs opacity-45 leading-relaxed">{cal.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-6">
                <span className="text-[10px] font-semibold opacity-35 flex items-center gap-1">
                  <Clock size={11} strokeWidth={1.5} />
                  {cal.duration}
                </span>
                <span className="text-[10px] font-semibold opacity-35">{cal.timezone}</span>
              </div>
            </div>
          </div>

          <div className="p-6 min-h-[440px]">
            {step === 'success' ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Check size={24} strokeWidth={2.5} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-primary font-display mb-2">{cal.confirmed}</h3>
                <p className="text-sm opacity-50 max-w-xs mb-4">{cal.confirmedDesc}</p>
                <div className="flex items-center gap-2 text-xs opacity-40 bg-surface px-3 py-1.5 rounded-full">
                  <Calendar size={12} strokeWidth={1.5} />
                  <span className="font-medium">{selectedDate ? formatDate(selectedDate, cal.months) : ''}</span>
                  <span className="opacity-50">·</span>
                  <span className="font-medium">{selectedSlot}</span>
                </div>
              </div>
            ) : step === 'calendar' ? (
              <>
                <div className="flex items-center justify-between mb-7">
                  <button onClick={goToPrevMonth} className="p-2 rounded-lg hover:bg-surface transition-colors text-primary opacity-50 hover:opacity-100">
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <span className="text-[15px] font-semibold text-primary font-display">{viewMonthLabel}</span>
                  <button onClick={goToNextMonth} className="p-2 rounded-lg hover:bg-surface transition-colors text-primary opacity-50 hover:opacity-100">
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-0 mb-3">
                  {cal.days.map((d: string) => (
                    <div key={d} className="text-[10px] font-semibold text-center opacity-30 py-1.5">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0">
                  {monthDays.map((d, i) => (
                    <div key={i} className="flex items-center justify-center">
                      {d !== null ? (
                        <button
                          onClick={() => selectDate(d)}
                          disabled={isPast(d)}
                          className={`w-10 h-10 rounded-xl text-sm transition-all duration-150 ${
                            isPast(d)
                              ? 'opacity-20 cursor-default'
                              : selectedStr === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                                ? 'bg-ink text-white shadow-md font-semibold'
                                : todayStr === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                                  ? 'text-accent font-bold hover:bg-surface'
                                  : 'text-primary hover:bg-surface font-medium'
                          }`}
                        >
                          {d}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-7 text-[11px] opacity-35">
                  <Zap size={11} strokeWidth={1.5} />
                  {cal.pickDate}
                </div>
              </>
            ) : step === 'slots' ? (
              <>
                <button onClick={() => setStep('calendar')} className="inline-flex items-center gap-2 text-sm opacity-50 hover:opacity-100 mb-6 transition-opacity font-medium">
                  <ArrowLeft size={15} strokeWidth={1.5} />
                  <span className="underline underline-offset-2">{selectedDate ? formatDate(selectedDate, cal.months) : ''}</span>
                </button>

                <p className="text-sm font-semibold text-primary font-display mb-5">{cal.pickTime}</p>

                <div className="space-y-5">
                  <SlotGroup label={lang === 'es' ? 'Mañana' : 'Morning'} slots={MORNING_SLOTS} selected={selectedSlot} onSelect={selectSlot} taken={takenSlots} />
                  <SlotGroup label={lang === 'es' ? 'Tarde' : 'Afternoon'} slots={AFTERNOON_SLOTS} selected={selectedSlot} onSelect={selectSlot} taken={takenSlots} />
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <button type="button" onClick={() => setStep('slots')} className="inline-flex items-center gap-1.5 text-xs opacity-50 hover:opacity-100 transition-opacity font-medium">
                    <ArrowLeft size={13} strokeWidth={1.5} />
                    {cal.back}
                  </button>
                  <div className="flex items-center gap-2 text-xs bg-surface px-3 py-1.5 rounded-full opacity-70">
                    <Calendar size={11} strokeWidth={1.5} />
                    <span className="font-medium">{selectedDate ? formatDate(selectedDate, cal.months) : ''}</span>
                    <span className="opacity-50">·</span>
                    <span className="font-medium">{selectedSlot}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-primary opacity-60">{cal.name} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/8 transition-all placeholder:opacity-40"
                    placeholder={cal.name}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 text-primary opacity-60">{cal.email} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/8 transition-all placeholder:opacity-40"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 text-primary opacity-60">{cal.notes}</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/8 transition-all placeholder:opacity-40 resize-y"
                    placeholder={cal.notesHint}
                  />
                </div>

                {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

                <button type="submit" disabled={step === 'sending'} className="btn btn-primary w-full py-4 mt-2">
                  {step === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                      {lang === 'es' ? 'Agendando...' : 'Booking...'}
                    </span>
                  ) : cal.confirm}
                </button>
              </form>
            )}
          </div>
        </div>

        <div data-reveal style={{ '--reveal-delay': '240ms' } as React.CSSProperties} className="space-y-3">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573005865312'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-3 p-4 hover:border-ink/20 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/15 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500" aria-hidden="true">
                <path d={siWhatsapp.path} />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50 mb-0.5">WhatsApp</div>
              <div className="text-sm font-semibold text-primary">{t.contact.whatsapp}</div>
            </div>
          </a>

          <a href={`mailto:${t.contact.email}`} className="card flex items-center gap-3 p-4 hover:border-ink/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 group-hover:bg-ink/5 transition-colors">
              <Mail size={18} strokeWidth={1.5} className="opacity-55" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50 mb-0.5">Email</div>
              <div className="text-sm font-semibold text-primary">{t.contact.email}</div>
            </div>
          </a>

          <div className="card flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0">
              <MapPin size={18} strokeWidth={1.5} className="opacity-55" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50 mb-0.5">
                {lang === 'es' ? 'Ubicación' : 'Location'}
              </div>
              <div className="text-sm font-semibold text-primary">{t.contact.location}</div>
            </div>
          </div>

          <div className="card flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0">
              <Wifi size={18} strokeWidth={1.5} className="opacity-55" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50 mb-0.5">
                {lang === 'es' ? 'Modalidad' : 'Mode'}
              </div>
              <div className="text-sm font-semibold text-primary">{t.contact.mode}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
