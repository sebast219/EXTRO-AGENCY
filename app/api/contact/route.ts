import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'

const PROJECT_LABELS: Record<string, string> = {
  web: 'Web o tienda virtual',
  app: 'Aplicación móvil',
  auto: 'Automatización / IA',
  eco: 'Ecosistema completo',
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

function buildEmailHtml(fields: { name: string; email: string; project: string; message: string }) {
  const rows = [
    { label: 'Nombre', value: fields.name },
    { label: 'Email', value: fields.email },
    { label: 'Proyecto', value: fields.project },
  ]
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#fafafa;font-family:system-ui,-apple-system,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;border-radius:12px">
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #e5e5e5">
            <span style="font-size:18px;font-weight:500;letter-spacing:2px;color:#0a0a0a">EX&middot;TRON</span>
            <span style="float:right;font-size:12px;color:#a3a3a3">Nuevo mensaje de contacto</span>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px">
            ${rows
              .map(
                (r) => `
            <div style="margin-bottom:16px">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a3a3a3;margin-bottom:4px">${r.label}</div>
              <div style="font-size:14px;color:#0a0a0a">${escapeHtml(r.value)}</div>
            </div>`,
              )
              .join('')}
            <div>
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a3a3a3;margin-bottom:4px">Mensaje</div>
              <div style="font-size:14px;color:#0a0a0a;line-height:1.6;white-space:pre-wrap">${escapeHtml(fields.message)}</div>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  const rl = rateLimit(`contact:${ip}`, { windowMs: 60_000, maxRequests: 3 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un minuto.' },
      { status: 429, headers: getRateLimitHeaders(rl) }
    )
  }

  let body: { name?: unknown; email?: unknown; project?: unknown; message?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de petición inválido.' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const project = typeof body.project === 'string' ? body.project : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (name.length < 2) {
    return NextResponse.json({ error: 'El nombre es obligatorio.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'El email no es válido.' }, { status: 400 })
  }
  if (!PROJECT_LABELS[project]) {
    return NextResponse.json({ error: 'Selecciona un tipo de proyecto.' }, { status: 400 })
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Cuéntanos un poco más del proyecto (mínimo 10 caracteres).' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ ok: true, simulated: true })
  }

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'EX·TRON <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO || 'contacto@extron.dev'],
      replyTo: email,
      subject: `Nuevo mensaje de contacto · ${name}`,
      html: buildEmailHtml({ name, email, project: PROJECT_LABELS[project], message }),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (err) {
    console.error('Resend exception:', err)
    return NextResponse.json({ error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' }, { status: 500 })
  }
}
