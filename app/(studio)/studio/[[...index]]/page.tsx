import { isSanityConfigured } from '@/lib/content/posts'
import Studio from './Studio'

export const dynamic = 'force-static'

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 font-sans">
        <div className="max-w-md text-center">
          <span className="text-xl font-medium tracking-[0.15em] block mb-6">EXTRO</span>
          <h1 className="text-lg font-medium mb-3">Studio no configurado</h1>
          <p className="text-sm leading-relaxed">
            Crea un proyecto en sanity.io y define <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> y{' '}
            <code>NEXT_PUBLIC_SANITY_DATASET</code> en tu archivo .env.local para activar el editor
            de contenido del blog.
          </p>
        </div>
      </main>
    )
  }
  return <Studio />
}
