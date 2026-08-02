import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

function isAuthorized(req: Request): boolean {
  const url = new URL(req.url)
  const token = url.searchParams.get('secret') || req.headers.get('x-sanity-secret')
  return Boolean(process.env.REVALIDATE_TOKEN && token === process.env.REVALIDATE_TOKEN)
}

function handle(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  return NextResponse.json({ revalidated: true })
}

export async function POST(req: Request) {
  return handle(req)
}

export async function GET(req: Request) {
  return handle(req)
}
