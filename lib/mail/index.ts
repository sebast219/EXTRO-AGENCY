import { Resend } from 'resend'
import { getServerEnv } from '@/lib/env'
import { log, captureException } from '@/lib/observability/logger'

/**
 * A-10: un solo módulo de correo.
 *
 * Antes `escapeHtml`, `buildEmailHtml` y la plantilla estaban copiados en
 * /api/contact y /api/booking, y ya habían divergido: una firmaba "EX·TRON" y la
 * otra "EXTRO". Aquí la marca, el escapado y el envío viven en un sitio.
 */

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const BRAND = 'EXTRO'

export type Row = { label: string; value: string }

function rowsHtml(rows: Row[]): string {
  return rows
    .map(
      (r) => `
      <div style="margin-bottom:16px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a3a3a3;margin-bottom:4px">${escapeHtml(r.label)}</div>
        <div style="font-size:14px;color:#0a0a0a">${escapeHtml(r.value)}</div>
      </div>`
    )
    .join('')
}

function layout(opts: { eyebrow: string; body: string }): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#fafafa;font-family:system-ui,-apple-system,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;border-radius:12px">
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #e5e5e5">
            <span style="font-size:18px;font-weight:600;letter-spacing:2px;color:#0a0a0a">${BRAND}</span>
            <span style="float:right;font-size:12px;color:#a3a3a3">${escapeHtml(opts.eyebrow)}</span>
          </td>
        </tr>
        <tr><td style="padding:24px 32px">${opts.body}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

// --- Plantillas -------------------------------------------------------------

export function contactNotification(f: { name: string; email: string; project: string; message: string }) {
  return layout({
    eyebrow: 'Nuevo mensaje de contacto',
    body: `
      ${rowsHtml([
        { label: 'Nombre', value: f.name },
        { label: 'Email', value: f.email },
        { label: 'Proyecto', value: f.project },
      ])}
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a3a3a3;margin-bottom:4px">Mensaje</div>
        <div style="font-size:14px;color:#0a0a0a;line-height:1.6;white-space:pre-wrap">${escapeHtml(f.message)}</div>
      </div>`,
  })
}

export function bookingNotification(f: {
  name: string
  email: string
  dateLabel: string
  timeLabel: string
  notes: string
  meetUrl: string | null
}) {
  const rows: Row[] = [
    { label: 'Nombre', value: f.name },
    { label: 'Email', value: f.email },
    { label: 'Fecha', value: f.dateLabel },
    { label: 'Hora', value: f.timeLabel },
  ]
  return layout({
    eyebrow: 'Nueva llamada agendada',
    body: `
      ${rowsHtml(rows)}
      ${
        f.meetUrl
          ? `<div style="margin-bottom:16px">
               <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a3a3a3;margin-bottom:4px">Meet</div>
               <a href="${escapeHtml(f.meetUrl)}" style="font-size:14px;color:#2a6b62">${escapeHtml(f.meetUrl)}</a>
             </div>`
          : `<div style="margin-bottom:16px;font-size:13px;color:#9c4a16">Sin enlace de Meet: revisa las credenciales de Google Calendar.</div>`
      }
      ${
        f.notes
          ? `<div>
               <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a3a3a3;margin-bottom:4px">Notas</div>
               <div style="font-size:14px;color:#0a0a0a;line-height:1.6;white-space:pre-wrap">${escapeHtml(f.notes)}</div>
             </div>`
          : ''
      }`,
  })
}

/** Confirmación al cliente: saludo, datos y botón de Meet. */
export function bookingConfirmation(f: {
  name: string
  dateLabel: string
  timeLabel: string
  timeZoneLabel: string
  meetUrl: string | null
  locale: 'es' | 'en'
}) {
  const es = f.locale === 'es'
  const firstName = f.name.split(' ')[0]

  const greeting = es ? `Hola ${firstName},` : `Hi ${firstName},`
  const intro = es
    ? 'Tu llamada de introducción con EXTRO quedó confirmada. Son 15 minutos para entender qué quieres construir y darte un rango de precio cerrado.'
    : 'Your intro call with EXTRO is confirmed. It is 15 minutes to understand what you want to build and give you a fixed price range.'
  const joinLabel = es ? 'Entrar a la reunión' : 'Join the meeting'
  const fallback = es
    ? 'Te enviamos también la invitación de calendario. Si necesitas mover la hora, responde a este correo.'
    : 'We also sent you a calendar invite. If you need to reschedule, just reply to this email.'
  const noLink = es
    ? 'Te enviaremos el enlace de la videollamada por correo antes de la reunión.'
    : 'We will email you the video call link before the meeting.'

  return layout({
    eyebrow: es ? 'Reunión confirmada' : 'Meeting confirmed',
    body: `
      <p style="font-size:16px;color:#0a0a0a;margin:0 0 14px">${escapeHtml(greeting)}</p>
      <p style="font-size:14px;color:#404040;line-height:1.65;margin:0 0 22px">${escapeHtml(intro)}</p>

      <div style="border:1px solid #e5e5e5;border-radius:10px;padding:18px 20px;margin-bottom:22px">
        ${rowsHtml([
          { label: es ? 'Fecha' : 'Date', value: f.dateLabel },
          { label: es ? 'Hora' : 'Time', value: `${f.timeLabel} · ${f.timeZoneLabel}` },
          { label: es ? 'Duración' : 'Duration', value: es ? '15 minutos' : '15 minutes' },
        ])}
      </div>

      ${
        f.meetUrl
          ? `<a href="${escapeHtml(f.meetUrl)}"
                style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 26px;border-radius:8px">
               ${escapeHtml(joinLabel)}
             </a>
             <p style="font-size:12px;color:#a3a3a3;margin:14px 0 0;word-break:break-all">${escapeHtml(f.meetUrl)}</p>`
          : `<p style="font-size:14px;color:#404040;line-height:1.65;margin:0">${escapeHtml(noLink)}</p>`
      }

      <p style="font-size:13px;color:#737373;line-height:1.65;margin:24px 0 0">${escapeHtml(fallback)}</p>`,
  })
}

// --- Envío ------------------------------------------------------------------

export type SendResult = { ok: true; id: string | null } | { ok: false; error: string }

let resend: Resend | null = null

export async function sendMail(opts: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
  event: string
}): Promise<SendResult> {
  const env = getServerEnv()

  if (env.mailDryRun) {
    log.info('mail.dry_run', { event: opts.event, to: opts.to, subject: opts.subject })
    return { ok: true, id: null }
  }

  if (!env.RESEND_API_KEY) {
    // getServerEnv ya impide llegar aquí en producción. En desarrollo, esto es
    // un error explícito en vez del antiguo `{ ok: true, simulated: true }`.
    return { ok: false, error: 'RESEND_API_KEY no definida. Usa MAIL_DRY_RUN=1 en desarrollo.' }
  }

  if (!resend) resend = new Resend(env.RESEND_API_KEY)

  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    })

    if (error) {
      await captureException(error, { event: `${opts.event}.resend_error` })
      return { ok: false, error: 'No se pudo enviar el correo.' }
    }

    log.info('mail.sent', { event: opts.event, id: data?.id })
    return { ok: true, id: data?.id ?? null }
  } catch (err) {
    await captureException(err, { event: `${opts.event}.resend_exception` })
    return { ok: false, error: 'No se pudo enviar el correo.' }
  }
}
