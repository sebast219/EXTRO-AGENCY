'use client'

import { useEffect } from 'react'
import { reportClientError } from '@/lib/observability/report-client-error'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // El digest es lo que permite correlacionar con la traza del servidor.
    reportClientError(error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '150px 24px 0', textAlign: 'center' }}>
      <h2 className="grad" style={{ margin: '0 0 16px', fontFamily: 'var(--font-space),sans-serif', fontWeight: 500, fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.04em' }}>
        Algo salió mal
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>No pudimos cargar el blog. Intenta de nuevo.</p>
      <button
        type="button"
        onClick={reset}
        className="btn-w"
        style={{ minHeight: 48, padding: '0 22px', borderRadius: 8, border: 0, background: '#fafafa', color: '#18181b', fontSize: 15, fontWeight: 600 }}
      >
        Reintentar
      </button>
    </div>
  )
}
