'use client'

/**
 * Envío de errores desde componentes de cliente hacia el pipeline estructurado
 * del servidor. `lib/observability/logger.ts` no se puede importar aquí: usa
 * `process.stdout`/`stderr`, que no existen en el navegador.
 *
 * `sendBeacon` no espera respuesta y sobrevive a que el usuario navegue fuera
 * de la página justo después del error, que es el momento típico en que ocurre
 * un fallo de render. Con `fetch` como respaldo para navegadores sin Beacon.
 */
export function reportClientError(error: Error & { digest?: string }): void {
  const payload = JSON.stringify({
    message: error.message,
    digest: error.digest,
    path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  })

  try {
    const sent =
      typeof navigator !== 'undefined' && 'sendBeacon' in navigator
        ? navigator.sendBeacon(
            '/api/log-client-error',
            new Blob([payload], { type: 'application/json' })
          )
        : false

    if (!sent) {
      void fetch('/api/log-client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      })
    }
  } catch {
    // El reporte de errores no puede lanzar dentro de un error boundary: eso
    // reemplazaría el mensaje original por un fallo del propio logging.
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('render_error', error)
  }
}
