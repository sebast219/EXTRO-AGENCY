import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EXTRO — Engineering-as-a-Subscription',
  description: 'Tu departamento de ingeniería por suscripción. Construimos software, AI y automatizaciones con avances funcionales cada viernes desde $500/mes.',
  keywords: ['engineering subscription', 'software development', 'AI', 'automation', 'Next.js', 'suscripción ingeniería', 'precio fijo'],
  authors: [{ name: 'EXTRO Engineering Studio' }],
  openGraph: {
    title: 'EXTRO — Engineering-as-a-Subscription',
    description: 'Tu departamento de ingeniería por suscripción. Avances funcionales cada viernes. Precio fijo.',
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EXTRO — Engineering-as-a-Subscription',
    description: 'Tu departamento de ingeniería por suscripción. Avances funcionales cada viernes. Precio fijo.',
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://extro.dev',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`} data-preloader="true">
      <body className="antialiased bg-white" style={{ color: '#000000' }} suppressHydrationWarning>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <filter id="preloader-edge" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
            </filter>
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
        </svg>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
