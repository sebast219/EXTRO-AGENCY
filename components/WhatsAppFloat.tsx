'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/573001234567"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-card-lg flex items-center justify-center hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
      aria-label="WhatsApp"
    >
      <MessageCircle size={26} fill="white" />
    </a>
  )
}
