'use client'

import { useState } from 'react'
import { useLang } from './LanguageProvider'
import { useReveal } from '@/lib/useReveal'
import { MessageCircle, Mail, MapPin, Wifi } from 'lucide-react'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-all disabled:opacity-40 placeholder:opacity-50'

export default function Contact() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>()
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          project: formData.get('project'),
          message: formData.get('message'),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setStatus('error'); return }
      setStatus('success')
      form.reset()
    } catch { setStatus('error') }
  }

  const submitLabel = () => {
    switch (status) {
      case 'sending': return lang === 'es' ? 'Enviando...' : 'Sending...'
      case 'success': return lang === 'es' ? 'Recibido!' : 'Received!'
      case 'error': return lang === 'es' ? 'Error, intenta de nuevo' : 'Error, try again'
      default: return t.contact.form.submit
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

      <div className="grid md:grid-cols-2 gap-10">
        <div data-reveal style={{ '--reveal-delay': '180ms' } as React.CSSProperties} className="space-y-4">
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5">
            <MessageCircle size={18} strokeWidth={1.5} className="opacity-55" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50 mb-0.5">WhatsApp</div>
              <div className="text-[15px] font-semibold text-primary">{t.contact.whatsapp}</div>
            </div>
          </a>
          <div className="card flex items-center gap-4 p-5">
            <Mail size={18} strokeWidth={1.5} className="opacity-55" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50 mb-0.5">Email</div>
              <div className="text-[15px] font-semibold text-primary">{t.contact.email}</div>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-5">
            <MapPin size={18} strokeWidth={1.5} className="opacity-55" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50 mb-0.5">
                {lang === 'es' ? 'Ubicación' : 'Location'}
              </div>
              <div className="text-[15px] font-semibold text-primary">{t.contact.location}</div>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-5">
            <Wifi size={18} strokeWidth={1.5} className="opacity-55" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-50 mb-0.5">
                {lang === 'es' ? 'Modalidad' : 'Mode'}
              </div>
              <div className="text-[15px] font-semibold text-primary">{t.contact.mode}</div>
            </div>
          </div>
        </div>

        <form
          data-reveal
          style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5 text-primary opacity-60">
              {t.contact.form.name}
            </label>
            <input id="contact-name" type="text" name="name" required disabled={status === 'sending'} className={inputClass} placeholder={t.contact.form.name} />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5 text-primary opacity-60">
              {t.contact.form.email}
            </label>
            <input id="contact-email" type="email" name="email" required disabled={status === 'sending'} className={inputClass} placeholder="tu@email.com" />
          </div>
          <div>
            <label htmlFor="contact-project" className="block text-sm font-medium mb-1.5 text-primary opacity-60">
              {t.contact.form.project}
            </label>
            <select id="contact-project" name="project" required disabled={status === 'sending'} className={inputClass}>
              <option value="">{t.contact.form.select}</option>
              {t.contact.form.options.map((opt, i) => (
                <option key={i} value={['web', 'app', 'auto', 'eco'][i]}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5 text-primary opacity-60">
              {t.contact.form.message}
            </label>
            <textarea id="contact-message" name="message" required rows={3} disabled={status === 'sending'} className={`${inputClass} resize-y`} placeholder={lang === 'es' ? 'Describe tu idea, objetivos...' : 'Describe your idea, goals...'} />
          </div>
          <div aria-live="polite">
            {status === 'error' && <p className="text-sm text-accent2">{lang === 'es' ? 'No se pudo enviar. Intenta por WhatsApp.' : 'Could not send. Try WhatsApp.'}</p>}
            {status === 'success' && <p className="text-sm opacity-55">{lang === 'es' ? 'Recibido! Te respondo en < 24h.' : 'Received! I reply within 24h.'}</p>}
          </div>
          <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full py-4">
            {submitLabel()}
          </button>
        </form>
      </div>
    </section>
  )
}
