'use client'

import { useCallback, useState } from 'react'
import { ArrowLeft, Calendar, Check, Clock, Loader2, Video, ExternalLink } from 'lucide-react'
import { useLang } from '@/components/LanguageProvider'
import MonthGrid from './MonthGrid'
import SlotPicker from './SlotPicker'
import { BOOKING_HORIZON_DAYS } from '@/features/booking/slots'
import { addDaysISO, formatDateLong, to12h, todayISO, type DateISO, type Time24 } from '@/features/booking/time'

/**
 * B-4: antes todo esto —calendario, horarios, formulario, fetch y presentación—
 * vivía en un único Contact.tsx de 401 líneas. Aquí el widget solo orquesta
 * estado y red; el dibujo está en MonthGrid y SlotPicker, y las reglas de
 * disponibilidad en features/booking.
 *
 * C-2: la disponibilidad ya no se inventa en el cliente. Se pide al servidor,
 * que la calcula contra la agenda real.
 */

type Step = 'date' | 'time' | 'form' | 'done'

type Confirmed = {
  dateLabel: string
  timeLabel: string
  meetUrl: string | null
}

// La zona de agenda es fija y del negocio, no del visitante.
const TIMEZONE = 'America/Bogota'

export default function BookingWidget() {
  const { lang, t } = useLang()
  const cal = t.contact.calendar

  // TIMEZONE es fija y del negocio (no la del navegador), así que el valor
  // inicial ya es correcto tanto en servidor como en cliente: no hace falta
  // recalcularlo en un efecto.
  const [today] = useState<DateISO>(() => todayISO(TIMEZONE))
  const [step, setStep] = useState<Step>('date')
  const [date, setDate] = useState<DateISO | null>(null)
  const [slot, setSlot] = useState<Time24 | ''>('')
  const [taken, setTaken] = useState<Set<Time24>>(new Set())
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null)

  const loadAvailability = useCallback(async (target: DateISO) => {
    setLoadingSlots(true)
    setError('')
    try {
      const res = await fetch(`/api/booking/availability?date=${target}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'error')
      setTaken(new Set<Time24>(data.taken ?? []))
    } catch {
      // Sin datos no se inventa disponibilidad: se muestran todos libres y el
      // servidor rechazará el hueco si resulta estar ocupado.
      setTaken(new Set())
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  const pickDate = (value: DateISO) => {
    setDate(value)
    setSlot('')
    setStep('time')
    void loadAvailability(value)
  }

  const pickSlot = (value: Time24) => {
    setSlot(value)
    setStep('form')
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!date || !slot) return

    const form = new FormData(e.currentTarget)
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          notes: form.get('notes') ?? '',
          website: form.get('website') ?? '',
          date,
          time: slot,
          locale: lang,
        }),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        // 409: el hueco se ocupó entre la carga y el envío. Se recarga.
        if (res.status === 409 && date) {
          await loadAvailability(date)
          setStep('time')
        }
        throw new Error(data.error ?? cal.errorGeneric)
      }

      setConfirmed({
        dateLabel: data.dateLabel ?? formatDateLong(date, lang, TIMEZONE),
        timeLabel: data.timeLabel ?? to12h(slot),
        meetUrl: data.meetUrl ?? null,
      })
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : cal.errorGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  const maxDate = addDaysISO(today, BOOKING_HORIZON_DAYS)
  const selectionLabel = date ? `${formatDateLong(date, lang, TIMEZONE)} · ${to12h(slot || '00:00')}` : ''

  return (
    <div className="card overflow-hidden rounded-xl border border-border">
      <div className="px-6 py-5 border-b border-border bg-surface/30">
        <div className="flex items-start justify-between gap-x-6 gap-y-2 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Video size={14} strokeWidth={1.5} className="text-secondary" aria-hidden="true" />
              <span className="text-sm font-semibold text-primary font-display">{cal.title}</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">{cal.desc}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-semibold text-tertiary flex items-center gap-1">
              <Clock size={11} strokeWidth={1.5} aria-hidden="true" />
              {cal.duration}
            </span>
            <span className="text-[10px] font-semibold text-tertiary">{cal.timezone}</span>
          </div>
        </div>
      </div>

      <div className="p-6 min-h-[440px]">
        {step === 'done' && confirmed ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <Check size={24} strokeWidth={2.5} className="text-emerald-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-primary font-display mb-2">{cal.confirmed}</h3>
            <p className="text-sm text-secondary max-w-xs mb-5">{cal.confirmedDesc}</p>

            <div className="flex items-center gap-2 text-xs text-secondary bg-surface px-3 py-1.5 rounded-full mb-6">
              <Calendar size={12} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-medium">{confirmed.dateLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium">{confirmed.timeLabel}</span>
            </div>

            {confirmed.meetUrl && (
              <>
                <a
                  href={confirmed.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary px-6 py-3.5 inline-flex items-center gap-2"
                >
                  {cal.joinMeeting}
                  <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
                </a>
                <p className="text-xs text-tertiary mt-4 max-w-xs">{cal.meetHint}</p>
              </>
            )}
          </div>
        ) : step === 'date' ? (
          <>
            <MonthGrid
              today={today}
              maxDate={maxDate}
              selected={date}
              onSelect={pickDate}
              labels={{
                days: cal.days,
                daysLong: cal.daysLong,
                months: cal.months,
                prevMonth: cal.prevMonth,
                nextMonth: cal.nextMonth,
                calendarLabel: cal.calendarLabel,
              }}
            />
            <p className="text-center mt-7 text-[11px] text-tertiary">{cal.pickDate}</p>
          </>
        ) : step === 'time' ? (
          <>
            <button
              type="button"
              onClick={() => setStep('date')}
              className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary mb-6 transition-colors font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" />
              <span className="underline underline-offset-2">
                {date ? formatDateLong(date, lang, TIMEZONE) : ''}
              </span>
            </button>

            <SlotPicker
              taken={taken}
              selected={slot}
              loading={loadingSlots}
              onSelect={pickSlot}
              labels={{
                morning: cal.morning,
                afternoon: cal.afternoon,
                loadingSlots: cal.loadingSlots,
                noSlots: cal.noSlots,
                takenLabel: cal.takenLabel,
                pickTime: cal.pickTime,
              }}
            />
          </>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button
                type="button"
                onClick={() => setStep('time')}
                className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <ArrowLeft size={13} strokeWidth={1.5} aria-hidden="true" />
                {cal.back}
              </button>
              <div className="flex items-center gap-2 text-xs bg-surface px-3 py-1.5 rounded-full text-secondary">
                <Calendar size={11} strokeWidth={1.5} aria-hidden="true" />
                <span className="font-medium">{selectionLabel}</span>
              </div>
            </div>

            <div>
              <label htmlFor="booking-name" className="block text-xs font-semibold mb-2 text-secondary">
                {cal.name} *
              </label>
              <input
                id="booking-name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/20 transition-all"
                placeholder={cal.name}
              />
            </div>

            <div>
              <label htmlFor="booking-email" className="block text-xs font-semibold mb-2 text-secondary">
                {cal.email} *
              </label>
              <input
                id="booking-email"
                name="email"
                type="email"
                required
                maxLength={160}
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/20 transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="booking-notes" className="block text-xs font-semibold mb-2 text-secondary">
                {cal.notes}
              </label>
              <textarea
                id="booking-notes"
                name="notes"
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/20 transition-all resize-y"
                placeholder={cal.notesHint}
              />
            </div>

            {/* Trampa para bots. Fuera de pantalla, no oculta con display:none. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] w-px h-px"
            />

            <p role="alert" aria-live="assertive" className="text-xs text-red-600 font-medium min-h-[1rem]">
              {error}
            </p>

            <button type="submit" disabled={submitting} className="btn btn-primary w-full py-4 mt-2">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} strokeWidth={2} className="animate-spin motion-reduce:hidden" aria-hidden="true" />
                  {cal.booking}
                </span>
              ) : (
                cal.confirm
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
