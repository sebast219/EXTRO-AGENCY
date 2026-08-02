import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'EX·TRON — Desarrollo de software con precio cerrado',
  description: 'Extron diseña y construye sitios, automatizaciones y software a medida para negocios que necesitan resultados en días, no en meses.',
  keywords: ['desarrollo software', 'Medellín', 'automatización', 'web apps', 'Next.js', 'WhatsApp API', 'software a medida'],
  authors: [{ name: 'EX·TRON' }],
  openGraph: {
    title: 'EX·TRON — Software con precio cerrado',
    description: 'Desarrollo de software con precio cerrado, entrega rápida y ejecución directa.',
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EX·TRON — Software con precio cerrado',
    description: 'Desarrollo de software con precio cerrado, entrega rápida y ejecución directa.',
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://extron.dev',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased bg-white text-primary">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
