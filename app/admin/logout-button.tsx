'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-border rounded-md text-tertiary hover:text-primary hover:border-primary transition-colors"
    >
      <LogOut size={14} />
      Cerrar sesión
    </button>
  )
}
