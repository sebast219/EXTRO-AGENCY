import { revalidatePath } from 'next/cache'
import { timingSafeEqual } from 'crypto'
import { getServerEnv } from '@/lib/env'
import { fail, ok } from '@/lib/http'
import { log } from '@/lib/observability/logger'

export const runtime = 'nodejs'

function authorized(req: Request): boolean {
  const token = req.headers.get('x-sanity-secret')
  const expected = getServerEnv().REVALIDATE_TOKEN
  if (!expected || !token) return false

  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  if (a.length !== b.length) {
    timingSafeEqual(a, a)
    return false
  }
  return timingSafeEqual(a, b)
}

export async function POST(req: Request) {
  if (!authorized(req)) return fail('Token inválido', 401)

  /**
   * M-7: `revalidatePath` necesita el segundo argumento cuando la ruta lleva
   * segmentos dinámicos. Sin él, Next trata '/blog/[slug]' como una ruta
   * literal y los artículos nunca se revalidaban.
   */
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  revalidatePath('/sitemap.xml')

  log.info('revalidate.done', { paths: ['/blog', '/blog/[slug]', '/sitemap.xml'] })
  return ok({ revalidated: true })
}
