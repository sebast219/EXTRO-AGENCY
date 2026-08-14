'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toDateISO, addDaysISO, type DateISO } from '@/features/booking/time'

/**
 * M-10: rejilla de calendario navegable con teclado.
 *
 * La versión anterior era una malla de <button> sin semántica ni navegación por
 * flechas y sin etiqueta accesible: un lector de pantalla anunciaba "17" sin
 * decir de qué mes ni si estaba disponible. Aquí se sigue el patrón de rejilla
 * de la APG: role="grid", tabindex móvil sobre el día enfocado, flechas para
 * moverse, Inicio/Fin para los extremos de la semana y RePág/AvPág para el mes.
 */

type Props = {
  today: DateISO
  maxDate: DateISO
  selected: DateISO | null
  onSelect: (date: DateISO) => void
  labels: {
    days: string[]
    daysLong: string[]
    months: string[]
    prevMonth: string
    nextMonth: string
    calendarLabel: string
  }
}

function monthCells(year: number, month0: number): (number | null)[] {
  const firstDow = new Date(Date.UTC(year, month0, 1)).getUTCDay()
  const total = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate()
  const cells: (number | null)[] = Array(firstDow).fill(null)
  for (let d = 1; d <= total; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function MonthGrid({ today, maxDate, selected, onSelect, labels }: Props) {
  const initial = selected ?? today
  const [year, setYear] = useState(() => Number(initial.slice(0, 4)))
  const [month0, setMonth0] = useState(() => Number(initial.slice(5, 7)) - 1)
  const [focusedDate, setFocusedDate] = useState<DateISO>(initial)

  const gridRef = useRef<HTMLDivElement>(null)
  const shouldRestoreFocus = useRef(false)

  const cells = useMemo(() => monthCells(year, month0), [year, month0])

  const isSelectable = (date: DateISO) => date >= today && date <= maxDate

  // Mantener el foco en la celda activa tras mover con el teclado.
  useEffect(() => {
    if (!shouldRestoreFocus.current) return
    shouldRestoreFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>('[data-focused="true"]')?.focus()
  }, [focusedDate])

  const moveFocus = (deltaDays: number) => {
    const next = addDaysISO(focusedDate, deltaDays)
    if (next < today || next > maxDate) return
    shouldRestoreFocus.current = true
    setFocusedDate(next)
    setYear(Number(next.slice(0, 4)))
    setMonth0(Number(next.slice(5, 7)) - 1)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      PageUp: -28,
      PageDown: 28,
    }
    if (e.key in map) {
      e.preventDefault()
      moveFocus(map[e.key])
      return
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      const dow = new Date(`${focusedDate}T12:00:00Z`).getUTCDay()
      moveFocus(e.key === 'Home' ? -dow : 6 - dow)
    }
  }

  const shiftMonth = (delta: number) => {
    const m = month0 + delta
    const nextYear = year + Math.floor(m / 12)
    const nextMonth = ((m % 12) + 12) % 12
    setYear(nextYear)
    setMonth0(nextMonth)
  }

  const monthLabel = `${labels.months[month0]} ${year}`
  const canGoPrev = toDateISO(year, month0, 1) > today
  const canGoNext = toDateISO(year, month0 + 1, 1) <= maxDate

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoPrev}
          aria-label={labels.prevMonth}
          className="p-2 rounded-lg hover:bg-surface transition-colors text-primary opacity-60 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <span aria-live="polite" className="text-[15px] font-semibold text-primary font-display">
          {monthLabel}
        </span>

        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={!canGoNext}
          aria-label={labels.nextMonth}
          className="p-2 rounded-lg hover:bg-surface transition-colors text-primary opacity-60 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={`${labels.calendarLabel} — ${monthLabel}`}
        onKeyDown={onKeyDown}
      >
        <div role="row" className="grid grid-cols-7 mb-3">
          {labels.days.map((d, i) => (
            <div
              key={d}
              role="columnheader"
              aria-label={labels.daysLong[i]}
              className="text-[10px] font-semibold text-center text-tertiary py-1.5"
            >
              {d}
            </div>
          ))}
        </div>

        {Array.from({ length: cells.length / 7 }).map((_, weekIndex) => (
          <div role="row" key={weekIndex} className="grid grid-cols-7">
            {cells.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, i) => {
              if (day === null) {
                return <div role="gridcell" key={`empty-${i}`} className="h-10" />
              }

              const date = toDateISO(year, month0, day)
              const selectable = isSelectable(date)
              const isSelected = selected === date
              const isToday = date === today
              const isFocused = focusedDate === date

              return (
                <div role="gridcell" key={date} className="flex items-center justify-center">
                  <button
                    type="button"
                    data-focused={isFocused}
                    tabIndex={isFocused ? 0 : -1}
                    disabled={!selectable}
                    aria-pressed={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${day} ${labels.months[month0]} ${year}`}
                    onFocus={() => setFocusedDate(date)}
                    onClick={() => selectable && onSelect(date)}
                    className={`w-10 h-10 rounded-xl text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      !selectable
                        ? 'text-tertiary/40 cursor-not-allowed'
                        : isSelected
                          ? 'bg-ink text-white shadow-md font-semibold'
                          : isToday
                            ? 'text-accent font-bold hover:bg-surface'
                            : 'text-primary hover:bg-surface font-medium'
                    }`}
                  >
                    {day}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
