'use client'

import { useState } from 'react'
import { useLang } from './LanguageProvider'
import { MessageCircle, Mail, MapPin, Wifi } from 'lucide-react'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const { lang, t } = useLang()
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
      if (!res.ok || !data.ok) {
        setStatus('error')
        return
      }
      setStatus('success')
      form.reset()
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
    }
  }

  const submitLabel = () => {
    switch (status) {
      case 'sending':
        return lang === 'es' ? 'Enviando...' : 'Sending...'
      case 'success':
        return lang === 'es' ? '¡Mensaje enviado!' : 'Message sent!'
      case 'error':
        return lang === 'es' ? 'Error al enviar' : 'Send failed'
      default:
        return t.contact.form.submit
    }
  }

  return (
    <section id="contact" className="py-20 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div className="section-label">{t.contact.label}</div>
      <h2 className="section-title">{t.contact.title}</h2>
      <p className="section-desc">{t.contact.desc}</p>

      <div className="grid md:grid-cols-2 gap-10 mt-10">
        <div className="space-y-4">
          <a
            href="https://wa.me/573001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-border rounded-xl card-hover"
          >
            <MessageCircle size={20} className="text-primary" />
            <div>
              <div className="text-xs text-tertiary mb-0.5">WhatsApp</div>
              <div className="text-[15px] font-medium text-primary">{t.contact.whatsapp}</div>
            </div>
          </a>

          <div className="flex items-center gap-4 p-4 border border-border rounded-xl">
            <Mail size={20} className="text-primary" />
            <div>
              <div className="text-xs text-tertiary mb-0.5">Email</div>
              <div className="text-[15px] font-medium text-primary">{t.contact.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border border-border rounded-xl">
            <MapPin size={20} className="text-primary" />
            <div>
              <div className="text-xs text-tertiary mb-0.5">{lang === 'es' ? 'Ubicación' : 'Location'}</div>
              <div className="text-[15px] font-medium text-primary">{t.contact.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border border-border rounded-xl">
            <Wifi size={20} className="text-primary" />
            <div>
              <div className="text-xs text-tertiary mb-0.5">{lang === 'es' ? 'Modalidad' : 'Mode'}</div>
              <div className="text-[15px] font-medium text-primary">{t.contact.mode}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-secondary font-medium mb-1.5">{t.contact.form.name}</label>
            <input
              type="text"
              name="name"
              required
              disabled={status === 'sending'}
              className="w-full px-4 py-3 border border-border rounded-xl bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              placeholder={t.contact.form.name}
            />
          </div>
          <div>
            <label className="block text-sm text-secondary font-medium mb-1.5">{t.contact.form.email}</label>
            <input
              type="email"
              name="email"
              required
              disabled={status === 'sending'}
              className="w-full px-4 py-3 border border-border rounded-xl bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm text-secondary font-medium mb-1.5">{t.contact.form.project}</label>
            <select
              name="project"
              required
              disabled={status === 'sending'}
              className="w-full px-4 py-3 border border-border rounded-xl bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
            >
              <option value="">{t.contact.form.select}</option>
              {t.contact.form.options.map((opt, i) => (
                <option key={i} value={['web', 'app', 'auto', 'eco'][i]}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-secondary font-medium mb-1.5">{t.contact.form.message}</label>
            <textarea
              name="message"
              required
              rows={4}
              disabled={status === 'sending'}
              className="w-full px-4 py-3 border border-border rounded-xl bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors resize-y disabled:opacity-50"
              placeholder={lang === 'es' ? 'Describe tu idea, objetivos y cualquier requerimiento especial...' : 'Describe your idea, goals, and any special requirements...'}
            />
          </div>
          {status === 'error' && (
            <p className="text-sm text-red-600">
              {lang === 'es'
                ? 'No se pudo enviar el mensaje. Escríbenos por WhatsApp o intenta de nuevo.'
                : 'Message could not be sent. Write us on WhatsApp or try again.'}
            </p>
          )}
          {status === 'success' && (
            <p className="text-sm text-green-600">
              {lang === 'es' ? '¡Recibido! Te respondemos en menos de 24 horas.' : 'Received! We reply within 24 hours.'}
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3.5 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel()}
          </button>
        </form>
      </div>
    </section>
  )
}
