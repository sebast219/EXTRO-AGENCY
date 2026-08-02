'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const res = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })

    if (res?.error) {
      setError('Credenciales incorrectas.')
      setLoading(false)
      return
    }

    router.push(callbackUrl?.startsWith('/admin') ? callbackUrl : '/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xl font-medium tracking-[0.15em] text-primary">
            EX<span className="opacity-40">·</span>TRON
          </span>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-tertiary hover:text-primary transition-colors">
            <ArrowLeft size={14} />
            Volver
          </Link>
        </div>

        <div className="p-8 border border-border rounded-xl bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-primary" />
            <h1 className="text-lg font-medium text-primary">Acceso restringido</h1>
          </div>
          <p className="text-sm text-tertiary mb-6">Panel de administración de EX·TRON</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-secondary font-medium mb-1.5">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-border rounded-xl bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="admin@extron.dev"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-secondary font-medium mb-1.5">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-border rounded-xl bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-tertiary mt-6">Solo personal autorizado · contacto@extron.dev</p>
      </div>
    </main>
  )
}
