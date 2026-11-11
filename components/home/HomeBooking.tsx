'use client'

import { useCallback, useMemo, useState } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { localizedPath } from '@/lib/i18n/config'
import { AFTERNOON_SLOTS, BOOKING_HORIZON_DAYS, MORNING_SLOTS } from '@/features/booking/slots'
import {
  addDaysISO,
  formatDateLong,
  isWeekend,
  to12h,
  toDateISO,
  todayISO,
  type DateISO,
  type Time24,
} from '@/features/booking/time'

type Step = 1 | 2 | 3 | 4

const TIMEZONE = 'America/Bogota'
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

const mono = 'var(--font-mono),monospace'
const space = 'var(--font-space),sans-serif'

const field: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  height: 40,
  padding: '0 12px',
  borderRadius: 8,
  border: '1px solid #27272a',
  background: 'rgba(39,39,42,0.3)',
  color: '#fafafa',
  font: 'inherit',
  fontSize: 14,
  boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
}
const label: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1,
  color: '#fafafa',
}
const backBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 44,
  padding: 0,
  background: 'none',
  border: 0,
  color: 'rgba(255,255,255,0.6)',
  fontSize: 14,
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function Back({ onClick, children }: { onClick: () => void; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={backBtn}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      {children}
    </button>
  )
}

export default function HomeBooking() {
  const { lang } = useLang()
  const [today] = useState<DateISO>(() => todayISO(TIMEZONE))
  const [step, setStep] = useState<Step>(1)
  const [date, setDate] = useState<DateISO | null>(null)
  const [slot, setSlot] = useState<Time24 | ''>('')
  const [taken, setTaken] = useState<Set<Time24>>(new Set())
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [meetUrl, setMeetUrl] = useState<string | null>(null)
  const [year, setYear] = useState(() => Number(today.slice(0, 4)))
  const [month0, setMonth0] = useState(() => Number(today.slice(5, 7)) - 1)

  const maxDate = addDaysISO(today, BOOKING_HORIZON_DAYS)

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(year, month0, 1)).getUTCDay()
    const total = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate()
    const out: (number | null)[] = Array(first).fill(null)
    for (let d = 1; d <= total; d++) out.push(d)
    while (out.length % 7 !== 0) out.push(null)
    return out
  }, [year, month0])

  const canGoPrev = toDateISO(year, month0, 1) > today
  const canGoNext = toDateISO(year, month0 + 1, 1) <= maxDate
  const shiftMonth = (delta: number) => {
    const m = month0 + delta
    setYear(year + Math.floor(m / 12))
    setMonth0(((m % 12) + 12) % 12)
  }

  const loadAvailability = useCallback(async (target: DateISO) => {
    setLoadingSlots(true)
    try {
      const res = await fetch(`/api/booking/availability?date=${target}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'error')
      setTaken(new Set<Time24>(data.taken ?? []))
    } catch {
      setTaken(new Set())
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  const pickDate = (value: DateISO) => {
    setDate(value)
    setSlot('')
    setStep(2)
    void loadAvailability(value)
  }

  const whenLabel = date ? `${formatDateLong(date, 'es', TIMEZONE)}${slot ? ` · ${to12h(slot)}` : ''}` : ''

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!date || !slot || !consent) return
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
        if (res.status === 409) {
          await loadAvailability(date)
          setStep(2)
        }
        throw new Error(data.error ?? 'No se pudo agendar. Intenta de nuevo.')
      }
      setMeetUrl(data.meetUrl ?? null)
      setStep(4)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agendar. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep(1)
    setDate(null)
    setSlot('')
    setConsent(false)
    setMeetUrl(null)
    setError('')
  }

  const stepColor = (n: number) => (n === step ? '#7fb2ff' : n < step ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)')

  const renderSlots = (slots: Time24[]) =>
    slots.map((t) => {
      const isTaken = taken.has(t)
      const selected = slot === t
      return (
        <button
          key={t}
          type="button"
          disabled={isTaken}
          onClick={() => {
            setSlot(t)
            setStep(3)
          }}
          style={{
            minHeight: 40,
            borderRadius: 8,
            border: `1px solid ${selected ? '#0066ff' : isTaken ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)'}`,
            background: selected ? '#0066ff' : 'transparent',
            color: isTaken ? 'rgba(255,255,255,0.25)' : '#fff',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: isTaken ? 'line-through' : 'none',
            cursor: isTaken ? 'default' : 'pointer',
          }}
        >
          {to12h(t)}
        </button>
      )
    })

  const pill: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 13px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(10,10,11,0.7)',
  }

  return (
    <section
      id="reserva"
      style={{ position: 'relative', zIndex: 1, isolation: 'isolate', padding: '0 24px clamp(80px, 9vw, 120px)', boxSizing: 'border-box' }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2
            className="grad rv"
            style={{ margin: '0 0 16px', fontFamily: space, fontWeight: 600, fontSize: 'clamp(34px, 4.2vw, 52px)', lineHeight: 1, letterSpacing: '-0.04em', textWrap: 'balance' }}
          >
            Elige fecha y hora
          </h2>
          <p style={{ margin: '0 0 22px', maxWidth: '46ch', fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
            Una videollamada de 15 minutos para entender tu proyecto, el alcance y una posible fecha de entrega.
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 10px', fontSize: 13.5, color: 'rgba(255,255,255,0.75)' }}>
            <li style={pill}>
              <Icon>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </Icon>
              15 minutos
            </li>
            <li style={pill}>
              <Icon>
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                <rect x="2" y="6" width="14" height="12" rx="2" />
              </Icon>
              Videollamada · el enlace llega a tu correo
            </li>
            <li style={pill}>
              <Icon>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </Icon>
              Hora de Bogotá (GMT-5)
            </li>
          </ul>
        </div>

        <div
          className="r-card"
          style={{ width: '100%', minWidth: 0, borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: '#0a0a0b', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: mono, fontSize: 12, flexWrap: 'wrap' }}>
            <span style={{ color: stepColor(1) }}>01 Fecha</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
            <span style={{ color: stepColor(2) }}>02 Hora</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
            <span style={{ color: stepColor(3) }}>03 Datos</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
            <span style={{ color: stepColor(4) }}>04 Listo</span>
          </div>

          <div className="step-in" key={step} style={{ padding: '24px 22px 26px' }}>
            {step === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <button
                    type="button"
                    onClick={() => shiftMonth(-1)}
                    disabled={!canGoPrev}
                    aria-label="Mes anterior"
                    style={{ ...backBtn, minWidth: 44, justifyContent: 'center', opacity: canGoPrev ? 1 : 0.25 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <span style={{ fontFamily: space, fontSize: 18, fontWeight: 600 }} aria-live="polite">
                    {MONTHS[month0]} {year}
                  </span>
                  <button
                    type="button"
                    onClick={() => shiftMonth(1)}
                    disabled={!canGoNext}
                    aria-label="Mes siguiente"
                    style={{ ...backBtn, minWidth: 44, justifyContent: 'center', opacity: canGoNext ? 1 : 0.25 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', marginBottom: 6 }} aria-hidden="true">
                  {DAY_NAMES.map((d) => (
                    <div key={d} style={{ fontFamily: mono, fontSize: 11, textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '6px 0' }}>
                      {d}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4 }}>
                  {cells.map((day, i) => {
                    if (day === null) return <div key={`e${i}`} style={{ height: 48 }} />
                    const iso = toDateISO(year, month0, day)
                    const off = iso < today || iso > maxDate || isWeekend(iso)
                    const selected = date === iso
                    return (
                      <div key={iso} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48 }}>
                        <button
                          type="button"
                          disabled={off}
                          onClick={() => pickDate(iso)}
                          aria-label={`${day} de ${MONTHS[month0].toLowerCase()}${off ? ', no disponible' : ''}`}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            border: `1px solid ${selected ? '#0066ff' : off ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                            background: selected ? '#0066ff' : off ? 'transparent' : 'rgba(255,255,255,0.04)',
                            color: selected ? '#fff' : off ? 'rgba(255,255,255,0.22)' : '#fff',
                            fontSize: 15,
                            fontWeight: 500,
                            fontVariantNumeric: 'tabular-nums',
                            cursor: off ? 'default' : 'pointer',
                          }}
                        >
                          {day}
                        </button>
                      </div>
                    )
                  })}
                </div>
                <p role="status" style={{ margin: '16px 0 0', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  Selecciona un día disponible · lun a vie
                </p>
              </div>
            )}

            {step === 2 && date && (
              <div>
                <Back onClick={() => setStep(1)}>{formatDateLong(date, 'es', TIMEZONE)}</Back>
                {loadingSlots ? (
                  <p role="status" style={{ margin: '10px 0', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                    Consultando disponibilidad…
                  </p>
                ) : (
                  <>
                    <p style={{ margin: '10px 0', fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Mañana</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8, marginBottom: 20 }}>
                      {renderSlots(MORNING_SLOTS)}
                    </div>
                    <p style={{ margin: '0 0 10px', fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Tarde</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
                      {renderSlots(AFTERNOON_SLOTS)}
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 3 && (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                  <Back onClick={() => setStep(2)}>Atrás</Back>
                  <span style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(0,102,255,0.14)', border: '1px solid rgba(0,102,255,0.4)', fontFamily: mono, fontSize: 12, color: '#cfe0ff' }}>
                    {whenLabel}
                  </span>
                </div>
                <div>
                  <label htmlFor="r-name" style={label}>Nombre *</label>
                  <input className="inp" id="r-name" name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" placeholder="Tu nombre" style={field} />
                </div>
                <div>
                  <label htmlFor="r-mail" style={label}>Correo *</label>
                  <input className="inp" id="r-mail" name="email" type="email" required maxLength={160} autoComplete="email" placeholder="tu@empresa.com" style={field} />
                </div>
                <div>
                  <label htmlFor="r-notes" style={label}>¿Qué quieres construir?</label>
                  <textarea
                    className="inp"
                    id="r-notes"
                    name="notes"
                    rows={3}
                    maxLength={1000}
                    placeholder="Cuéntanos en pocas líneas tu proyecto o el problema que quieres resolver."
                    style={{ ...field, height: 'auto', minHeight: 72, padding: '8px 12px', lineHeight: 1.5, resize: 'vertical' }}
                  />
                </div>
                {/* Trampa para bots: fuera de pantalla, no oculta con display:none. */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1 }} />
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.65)', cursor: 'pointer', textAlign: 'left' }}>
                  <input type="checkbox" checked={consent} onChange={() => setConsent(!consent)} style={{ flex: 'none', width: 16, height: 16, margin: '2px 0 0', accentColor: '#0066ff' }} />
                  <span>
                    Autorizo a EXTRO a tratar mis datos para agendar y atender esta llamada, según la{' '}
                    <a href={`${localizedPath('/terms', lang)}#datos`} style={{ color: '#fff' }}>política de datos</a>.
                  </span>
                </label>
                <p role="alert" aria-live="assertive" style={{ margin: 0, minHeight: 16, fontSize: 13, color: '#f87171' }}>{error}</p>
                <button
                  type="submit"
                  disabled={!consent || submitting}
                  className="btn-w mag"
                  style={{ minHeight: 50, borderRadius: 8, border: 0, background: '#fafafa', color: '#18181b', fontSize: 15, fontWeight: 600, opacity: consent ? 1 : 0.45, cursor: consent ? 'pointer' : 'not-allowed' }}
                >
                  {submitting ? 'Agendando…' : 'Confirmar llamada'}
                </button>
              </form>
            )}

            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '36px 0 20px' }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: 'rgba(0,102,255,0.14)', border: '1px solid rgba(0,102,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, boxShadow: '0 0 30px rgba(0,102,255,0.3)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7fb2ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 style={{ margin: '0 0 8px', fontFamily: space, fontSize: 24, fontWeight: 600 }}>Llamada agendada</h3>
                <p style={{ margin: '0 0 18px', maxWidth: 340, fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
                  Te enviamos la invitación con el enlace a tu correo. Hablamos pronto.
                </p>
                <span style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 22 }}>
                  {whenLabel}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                  {meetUrl && (
                    <a href={meetUrl} target="_blank" rel="noopener noreferrer" className="btn-w mag" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 18px', borderRadius: 8, background: '#fafafa', color: '#18181b', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                      Entrar a la reunión
                    </a>
                  )}
                  <button type="button" onClick={reset} className="btn-g mag" style={{ minHeight: 44, padding: '0 18px', borderRadius: 8, background: 'rgba(9,9,11,0.6)', border: '1px solid #27272a', color: '#fff', fontSize: 14, fontWeight: 500 }}>
                    Agendar otra llamada
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
