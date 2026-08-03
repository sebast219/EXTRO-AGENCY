import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { timingSafeEqual } from 'crypto'

function isAuthorized(req: Request): boolean {
  const token = req.headers.get('x-sanity-secret')
  const expected = process.env.REVALIDATE_TOKEN
  if (!expected || !token) return false
  const bufA = Buffer.from(token)
  const bufB = Buffer.from(expected)
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]')
  return NextResponse.json({ revalidated: true })
}
