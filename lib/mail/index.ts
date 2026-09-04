import { Resend } from 'resend'
import { getServerEnv } from '@/lib/env'
import { log, captureException } from '@/lib/observability/logger'

/**
 * A-10: Módulo unificado de correo EXTRO
 *
 * Sistema de diseño:
 * - Colores: --accent #0066ff, --accent-dark #0044cc, --ink #0a0a0a,
 *            --surface #f5f5f7, --surface-elevated #fafafa, --line #e5e5e5
 * - Tipografía: Space Grotesk (display) + Inter (body)
 * - Radio: 12px
 * - Sombras: sutil en CTAs y tarjetas
 */

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const BRAND = 'EXTRO'
const FONT_DISPLAY = "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"
const FONT_SANS = "Inter, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"

export type Row = { label: string; value: string }

/* ============================================================
   COMPONENTES BASE
   ============================================================ */

function statusDot(color: string): string {
  return `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};margin-right:8px;vertical-align:middle"></span>`
}

function rowsHtml(rows: Row[]): string {
  return rows
    .map(
      (r, i) => `
      <div style="padding:14px 0;border-bottom:1px solid ${i === rows.length - 1 ? 'transparent' : '#f0f0f0'}">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#8a8a8a;margin-bottom:6px">${escapeHtml(r.label)}</div>
        <div style="font-size:15px;color:#0a0a0a;line-height:1.6;word-break:break-word;white-space:pre-wrap;font-weight:500">${escapeHtml(r.value)}</div>
      </div>`
    )
    .join('')
}

function gradientLine(): string {
  return `<div style="height:1px;background:linear-gradient(90deg,transparent 0%,#e5e5e5 20%,#e5e5e5 80%,transparent 100%);margin:24px 0"></div>`
}

function ctaButton(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 12px">
      <tr>
        <td style="border-radius:10px;background:linear-gradient(135deg,#0066ff,#0044cc);box-shadow:0 4px 14px rgba(0,102,255,0.25)">
          <a href="${escapeHtml(href)}"
             style="display:inline-block;padding:16px 36px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:10px">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`
}

/* ============================================================
   LAYOUT PRINCIPAL
   ============================================================ */

type LayoutVariant = 'default' | 'hero-blue' | 'notification'

function layout(opts: {
  eyebrow: string
  body: string
  variant?: LayoutVariant
  statusColor?: string
}): string {
  const variant = opts.variant ?? 'default'
  const status = opts.statusColor ? statusDot(opts.statusColor) : ''

  // Hero condicional
  const hero = variant === 'hero-blue'
    ? opts.body // El body ya incluye el hero
    : `<div style="padding:32px">${opts.body}</div>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    @media (prefers-color-scheme: dark) {
      body { background-color: #0a0a0a !important; }
      .email-wrapper { background-color: #141414 !important; }
      .card { background-color: #1a1a1a !important; border-color: #2a2a2a !important; }
      .text-primary { color: #f5f5f7 !important; }
      .text-secondary { color: #a0a0a0 !important; }
      .text-muted { color: #6b6b6b !important; }
      .row-border { border-color: #2a2a2a !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:${FONT_SANS};-webkit-font-smoothing:antialiased">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%" class="email-wrapper">

        <!-- Header -->
        <tr>
          <td style="padding:0 0 24px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;letter-spacing:2px;color:#0a0a0a" class="text-primary">
                    ${BRAND}<span style="color:#0066ff">.</span>
                  </span>
                </td>
                <td align="right" style="font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#6b6b6b" class="text-muted">
                  ${status}${escapeHtml(opts.eyebrow)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Card principal -->
        <tr>
          <td style="background:#ffffff;border:1px solid #e5e5e5;border-radius:14px;overflow:hidden" class="card">
            ${hero}
          </td>
        </tr>

        <!-- Footer premium -->
        <tr>
          <td align="center" style="padding:32px 20px 0">
            <div style="background:#0a0a0a;border-radius:12px;padding:28px 24px;text-align:center">
              <div style="font-family:${FONT_DISPLAY};font-size:18px;font-weight:700;letter-spacing:2px;color:#ffffff">${BRAND}</div>
              <div style="font-size:13px;color:#8a8a8a;margin-top:10px">Agencia de Ingeniería de Software</div>
              <div style="font-size:12px;color:#6b6b6b;margin-top:16px;line-height:1.8">
                hola@extro.com.co<br/>
                Medellín, Colombia
              </div>
              <div style="font-size:11px;color:#4a4a4a;margin-top:16px;padding-top:16px;border-top:1px solid #2a2a2a">
                © 2026 ${BRAND}. Todos los derechos reservados.
              </div>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}

/* ============================================================
   PLANTILLAS
   ============================================================ */

export function contactNotification(f: {
  name: string
  email: string
  project: string
  message: string
}) {
  return layout({
    variant: 'notification',
    statusColor: '#22c55e',
    eyebrow: 'Nuevo lead',
    body: `
      <div style="padding:8px 0 16px">
        <h2 style="font-family:${FONT_DISPLAY};font-size:20px;font-weight:600;color:#0a0a0a;margin:0 0 8px;letter-spacing:-0.01em" class="text-primary">
          ${escapeHtml(f.name)} quiere construir algo
        </h2>
        <p style="font-size:14px;color:#6b6b6b;margin:0" class="text-muted">
          Recibido desde el formulario de contacto de extro.com.co
        </p>
      </div>

      ${gradientLine()}

      ${rowsHtml([
        { label: 'Nombre', value: f.name },
        { label: 'Email', value: f.email },
        { label: 'Proyecto', value: f.project },
      ])}

      <div style="margin-top:8px">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#8a8a8a;margin-bottom:8px">Mensaje</div>
        <div style="background:#fafafa;border-radius:10px;padding:20px;font-size:14px;color:#0a0a0a;line-height:1.7;white-space:pre-wrap;border:1px solid #f0f0f0" class="text-primary">
          ${escapeHtml(f.message)}
        </div>
      </div>

      <div style="margin-top:24px;text-align:center">
        <a href="mailto:${escapeHtml(f.email)}"
           style="display:inline-block;padding:12px 28px;background:#0a0a0a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:10px">
          Responder a ${escapeHtml(f.name.split(' ')[0])}
        </a>
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
    variant: 'notification',
    statusColor: '#f59e0b',
    eyebrow: 'Llamada agendada',
    body: `
      <div style="padding:8px 0 16px">
        <h2 style="font-family:${FONT_DISPLAY};font-size:20px;font-weight:600;color:#0a0a0a;margin:0 0 8px;letter-spacing:-0.01em" class="text-primary">
          ${escapeHtml(f.name)} agendó una intro call
        </h2>
        <p style="font-size:14px;color:#6b6b6b;margin:0" class="text-muted">
          Desde el calendario de extro.com.co
        </p>
      </div>

      ${gradientLine()}

      ${rowsHtml(rows)}

      ${
        f.meetUrl
          ? `<div style="margin-top:16px;padding:16px;background:#f0f7ff;border-radius:10px;border:1px solid #dbeafe">
               <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#0066ff;margin-bottom:6px">Google Meet</div>
               <a href="${escapeHtml(f.meetUrl)}" style="font-size:14px;color:#0066ff;font-weight:500;word-break:break-all;text-decoration:none">${escapeHtml(f.meetUrl)}</a>
             </div>`
          : `<div style="margin-top:16px;padding:16px;background:#fef3c7;border-radius:10px;border:1px solid #fde68a">
               <div style="font-size:13px;color:#92400e;font-weight:500">
                 ⚠️ Sin enlace de Meet: revisa las credenciales de Google Calendar.
               </div>
             </div>`
      }

      ${
        f.notes
          ? `<div style="margin-top:16px">
               <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#8a8a8a;margin-bottom:8px">Notas del cliente</div>
               <div style="background:#fafafa;border-radius:10px;padding:16px;font-size:14px;color:#0a0a0a;line-height:1.7;white-space:pre-wrap;border:1px solid #f0f0f0" class="text-primary">
                 ${escapeHtml(f.notes)}
               </div>
             </div>`
          : ''
      }`,
  })
}

export function bookingConfirmation(f: {
  name: string
  email: string
  notes: string
  dateLabel: string
  weekday: string
  timeLabel: string
  timeZoneLabel: string
  meetUrl: string | null
  locale: 'es' | 'en'
}) {
  const es = f.locale === 'es'
  const firstName = f.name.split(' ')[0]

  const confirmedLabel = es ? 'CONFIRMADO' : 'CONFIRMED'
  const title = es ? 'Reunión confirmada' : 'Meeting confirmed'
  const greeting = es ? `Hola ${firstName},` : `Hi ${firstName},`
  const intro = es
    ? 'Tu llamada de introducción con EXTRO quedó confirmada. Son 15 minutos para entender qué quieres construir y darte un rango de precio cerrado.'
    : 'Your intro call with EXTRO is confirmed. It is 15 minutes to understand what you want to build and give you a fixed price range.'
  const joinLabel = es ? 'Entrar a la reunión' : 'Join the meeting'
  const noLink = es
    ? 'El enlace de la videollamada te llegará por correo antes de la reunión.'
    : 'We will email you the video call link before the meeting.'
  const calendarNote = es
    ? 'También recibes la invitación de calendario de Google con el recordatorio. Si necesitas mover la hora, responde a este correo.'
    : 'You also get the Google Calendar invite with a reminder. If you need to reschedule, just reply to this email.'

  const details: Row[] = [
    { label: es ? 'Día' : 'Day', value: f.weekday },
    { label: es ? 'Fecha' : 'Date', value: f.dateLabel },
    { label: es ? 'Hora' : 'Time', value: `${f.timeLabel} · ${f.timeZoneLabel}` },
    { label: es ? 'Duración' : 'Duration', value: es ? '15 minutos' : '15 minutes' },
    { label: es ? 'Tu correo' : 'Your email', value: f.email },
  ]
  if (f.notes) details.push({ label: es ? 'Notas' : 'Notes', value: f.notes })

  return layout({
    variant: 'hero-blue',
    eyebrow: es ? 'Reunión confirmada' : 'Meeting confirmed',
    body: `
      <!-- Hero azul con profundidad -->
      <div style="background:linear-gradient(135deg,#3388ff 0%,#0066ff 45%,#0044cc 100%);padding:48px 32px 40px;text-align:center;position:relative;overflow:hidden">
        <!-- Elemento decorativo sutil -->
        <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;background:rgba(255,255,255,0.03);border-radius:50%"></div>
        <div style="position:absolute;bottom:-40px;left:-40px;width:150px;height:150px;background:rgba(255,255,255,0.03);border-radius:50%"></div>

        <div style="position:relative;z-index:1">
          <div style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:2px;color:#ffffff;border:1px solid rgba(255,255,255,0.35);border-radius:999px;padding:8px 18px;margin-bottom:20px;background:rgba(255,255,255,0.08);backdrop-filter:blur(4px)">
            ✓ ${escapeHtml(confirmedLabel)}
          </div>
          <div style="font-family:${FONT_DISPLAY};font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;line-height:1.15;margin-bottom:12px">
            ${escapeHtml(title)}
          </div>
          <div style="font-size:16px;color:rgba(255,255,255,0.9);font-weight:500">
            ${escapeHtml(greeting)}
          </div>
        </div>
      </div>

      <div style="padding:36px 32px 32px">
        <p style="font-size:15px;color:#404040;line-height:1.7;margin:0 0 28px;letter-spacing:-0.01em" class="text-secondary">
          ${escapeHtml(intro)}
        </p>

        <div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:12px;padding:20px 24px;margin-bottom:28px">
          ${rowsHtml(details)}
        </div>

        ${
          f.meetUrl
            ? `<div style="text-align:center;margin-bottom:8px">
                 ${ctaButton(f.meetUrl, joinLabel)}
                 <p style="font-size:12px;color:#8a8a8a;margin:8px 0 0;word-break:break-all" class="text-muted">${escapeHtml(f.meetUrl)}</p>
               </div>`
            : `<div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin-bottom:24px">
                 <p style="font-size:14px;color:#92400e;margin:0;font-weight:500">${escapeHtml(noLink)}</p>
               </div>`
        }

        <div style="border-top:1px solid #f0f0f0;padding-top:20px;margin-top:24px">
          <p style="font-size:13px;color:#737373;line-height:1.7;margin:0" class="text-muted">
            ${escapeHtml(calendarNote)}
          </p>
        </div>
      </div>`,
  })
}

/* ============================================================
   ENVÍO
   ============================================================ */

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