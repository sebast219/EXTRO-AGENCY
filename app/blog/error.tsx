'use client'

import { useEffect } from 'react'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Blog error:', error)
  }, [error])

  return (
    <div className="min-h-screen pt-32 px-6 max-w-xl mx-auto text-center">
      <h2 className="section-title mb-4">Algo sali&oacute; mal</h2>
      <p className="section-desc mb-8">No pudimos cargar el blog. Intenta de nuevo.</p>
      <button onClick={reset} className="btn btn-primary px-6 py-3">
        Reintentar
      </button>
    </div>
  )
}
