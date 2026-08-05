'use client'

import { siWhatsapp } from 'simple-icons'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573005865312'

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-card-lg flex items-center justify-center hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
      aria-label="WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d={siWhatsapp.path} />
      </svg>
    </a>
  )
}
