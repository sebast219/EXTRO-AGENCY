'use client'

import { Loader2 } from 'lucide-react'
import { MORNING_SLOTS, AFTERNOON_SLOTS } from '@/features/booking/slots'
import { to12h, type Time24 } from '@/features/booking/time'

type Props = {
  taken: Set<Time24>
  selected: Time24 | ''
  loading: boolean
  onSelect: (slot: Time24) => void
  labels: {
    morning: string
    afternoon: string
    loadingSlots: string
    noSlots: string
    takenLabel: string
    pickTime: string
  }
}

function Group({
  label,
  slots,
  taken,
  selected,
  onSelect,
  takenLabel,
}: {
  label: string
  slots: Time24[]
  taken: Set<Time24>
  selected: Time24 | ''
  onSelect: (s: Time24) => void
  takenLabel: string
}) {
  const anyFree = slots.some((s) => !taken.has(s))
  if (!anyFree) return null

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-tertiary mb-2.5">{label}</p>
      <div className="grid grid-cols-4 gap-1.5">
        {slots.map((slot) => {
          const isTaken = taken.has(slot)
          const display = to12h(slot)
          return (
            <button
              key={slot}
              type="button"
              onClick={() => !isTaken && onSelect(slot)}
              disabled={isTaken}
              // M-10: el estado no puede comunicarse solo con tachado y opacidad.
              aria-label={isTaken ? `${display} — ${takenLabel}` : display}
              className={`text-xs py-2.5 px-2 rounded-lg font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                isTaken
                  ? 'text-tertiary/50 line-through cursor-not-allowed bg-surface/30'
                  : selected === slot
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-surface/50 text-primary hover:bg-ink/8 hover:text-ink'
              }`}
            >
              {display}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function SlotPicker({ taken, selected, loading, onSelect, labels }: Props) {
  if (loading) {
    return (
      <div role="status" className="flex items-center gap-2 py-10 text-sm text-secondary">
        <Loader2 size={15} strokeWidth={2} className="animate-spin motion-reduce:hidden" aria-hidden="true" />
        {labels.loadingSlots}
      </div>
    )
  }

  const allTaken = [...MORNING_SLOTS, ...AFTERNOON_SLOTS].every((s) => taken.has(s))
  if (allTaken) {
    return (
      <p role="status" className="py-10 text-sm text-secondary">
        {labels.noSlots}
      </p>
    )
  }

  return (
    <>
      <p className="text-sm font-semibold text-primary font-display mb-5">{labels.pickTime}</p>
      <div className="space-y-5">
        <Group
          label={labels.morning}
          slots={MORNING_SLOTS}
          taken={taken}
          selected={selected}
          onSelect={onSelect}
          takenLabel={labels.takenLabel}
        />
        <Group
          label={labels.afternoon}
          slots={AFTERNOON_SLOTS}
          taken={taken}
          selected={selected}
          onSelect={onSelect}
          takenLabel={labels.takenLabel}
        />
      </div>
    </>
  )
}
