import type { Metadata } from 'next'
import '../../globals.css'

/**
 * Segundo layout raíz. Sanity Studio es una aplicación completa que monta su
 * propio shell, así que no comparte el layout del sitio: ni fuentes, ni
 * LanguageProvider, ni JSON-LD.
 *
 * Next.js admite varios layouts raíz cuando cada uno vive en su propio grupo de
 * rutas; la navegación entre grupos hace recarga completa, que aquí es lo
 * deseable.
 */
export const metadata: Metadata = {
  title: 'Studio · EXTRO',
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
