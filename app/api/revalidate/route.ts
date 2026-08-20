import { revalidatePath, revalidateTag } from 'next/cache'
import { timingSafeEqual } from 'crypto'
import { getServerEnv } from '@/lib/env'
import { fail, ok } from '@/lib/http'
import { log } from '@/lib/observability/logger'
import { extractSlugFromWebhookPayload } from '@/lib/content/posts'

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

  /**
   * `lib/content/posts.ts` cachea los datos de Sanity con `unstable_cache`
   * (tag 'posts' para el listado, 'post'/'post:<slug>' por artículo, TTL
   * 60s). `revalidatePath` solo invalida el HTML de las rutas de arriba —
   * sin `revalidateTag` esa caché de datos seguía viva hasta que expiraba
   * sola, así que una página revalidada podía volver a pedir datos y recibir
   * el mismo contenido cacheado.
   *
   * El slug granular depende de que el webhook de Sanity esté configurado
   * (en sanity.io, fuera de este repo) para mandar el documento o su slug en
   * el payload — si no lo manda, el post individual se sigue refrescando
   * solo al expirar el TTL de 60s.
   */
  /**
   * Next 16.3 exige un segundo argumento (`profile`) desde que separó
   * `revalidateTag` (fuera de Server Actions) de `updateTag`. 'max' fuerza
   * la expiración inmediata de todo lo cacheado bajo el tag, que es el
   * comportamiento que ya teníamos antes de este cambio de API.
   */
  revalidateTag('posts', 'max')
  const body = await req.json().catch(() => null)
  const slug = extractSlugFromWebhookPayload(body)
  if (slug) revalidateTag(`post:${slug}`, 'max')

  const tags = slug ? ['posts', `post:${slug}`] : ['posts']
  log.info('revalidate.done', { paths: ['/blog', '/blog/[slug]', '/sitemap.xml'], tags })
  return ok({ revalidated: true })
}
