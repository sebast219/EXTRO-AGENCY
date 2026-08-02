import type { Metadata } from 'next'
import { isSanityConfigured } from '@/lib/sanity'
import Studio from './Studio'

export const metadata: Metadata = {
  title: 'Studio · EX·TRON',
  robots: { index: false, follow: false },
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="text-xl font-medium tracking-[0.15em] text-primary block mb-6">
            EX<span className="opacity-40">·</span>TRON
          </span>
          <h1 className="text-lg font-medium text-primary mb-3">Studio no configurado</h1>
          <p className="text-sm text-secondary leading-relaxed">
            Crea un proyecto gratuito en sanity.io y define{' '}
            <code className="text-primary">NEXT_PUBLIC_SANITY_PROJECT_ID</code> y{' '}
            <code className="text-primary">NEXT_PUBLIC_SANITY_DATASET</code> en tu archivo .env.local
            para activar el editor de contenido del blog.
          </p>
        </div>
      </main>
    )
  }
  return <Studio />
}
