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
    url: 'https://extro.com.co',
    siteName: 'EXTRO',
    images: [
      {
        url: 'https://extro.com.co/og.png',
        width: 1200,
        height: 630,
        alt: 'EXTRO — Engineering-as-a-Subscription',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EXTRO — Engineering-as-a-Subscription',
    description: 'Tu departamento de ingeniería por suscripción. Avances funcionales cada viernes. Precio fijo.',
    images: ['https://extro.com.co/og.png'],
  },
  robots: 'index, follow',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EXTRO',
  url: 'https://extro.com.co',
  logo: 'https://extro.com.co/icon.png',
  description:
    'Tu departamento de ingeniería por suscripción. Construimos software, IA y automatizaciones con avances funcionales cada viernes.',
  email: 'engineering@extro.dev',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Medellín',
    addressCountry: 'CO',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EXTRO — Engineering-as-a-Subscription',
  url: 'https://extro.com.co',
  inLanguage: 'es',
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <body className="antialiased bg-white" style={{ color: '#000000' }} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-ink focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Saltar al contenido
        </a>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </body>
    </html>
  )
}
