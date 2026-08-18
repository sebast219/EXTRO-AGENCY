'use client'

import { Mail, MapPin, Wifi } from 'lucide-react'
import { siWhatsapp } from 'simple-icons'
import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import BookingWidget from './booking/BookingWidget'

/**
 * B-4: esta sección volvió a ser lo que su nombre dice. El calendario, los
 * horarios, el formulario y el fetch salieron a components/booking/.
 */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.1em] text-tertiary mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-primary">{value}</div>
      </div>
    </div>
  )
}

export default function Contact() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573005865312'

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
        <div data-reveal style={{ '--reveal-delay': '180ms' } as React.CSSProperties}>
          <BookingWidget />
        </div>

        <div data-reveal style={{ '--reveal-delay': '240ms' } as React.CSSProperties} className="space-y-3">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-3 p-4 hover:border-ink/20 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/15 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600" aria-hidden="true">
                <path d={siWhatsapp.path} />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-tertiary mb-0.5">WhatsApp</div>
              <div className="text-sm font-semibold text-primary">{t.contact.whatsapp}</div>
            </div>
          </a>

          <a href={`mailto:${t.contact.email}`} className="card flex items-center gap-3 p-4 hover:border-ink/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 group-hover:bg-ink/5 transition-colors">
              <Mail size={18} strokeWidth={1.5} className="text-secondary" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-tertiary mb-0.5">Email</div>
              <div className="text-sm font-semibold text-primary">{t.contact.email}</div>
            </div>
          </a>

          <InfoCard
            icon={<MapPin size={18} strokeWidth={1.5} className="text-secondary" aria-hidden="true" />}
            label={lang === 'es' ? 'Ubicación' : 'Location'}
            value={t.contact.location}
          />

          <InfoCard
            icon={<Wifi size={18} strokeWidth={1.5} className="text-secondary" aria-hidden="true" />}
            label={lang === 'es' ? 'Modalidad' : 'Mode'}
            value={t.contact.mode}
          />
        </div>
      </div>
    </section>
  )
}
