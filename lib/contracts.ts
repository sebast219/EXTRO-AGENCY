import { z } from 'zod'
import { DATE_RE, TIME_RE } from '@/features/booking/time'
import { ALL_SLOTS } from '@/features/booking/slots'

/**
 * A-9: un esquema por endpoint, en un solo archivo.
 *
 * Antes cada ruta validaba a mano y las reglas ya habían divergido: contacto
 * exigía 10 caracteres de mensaje y reserva no acotaba `notes` en absoluto, así
 * que un cuerpo de varios megabytes llegaba intacto a Resend. Todos los campos
 * de texto tienen ahora un máximo.
 */

/** Tamaño máximo del cuerpo aceptado en cualquier ruta POST. */
export const MAX_BODY_BYTES = 16 * 1024

export const PROJECT_KINDS = ['web', 'app', 'auto', 'eco'] as const
export type ProjectKind = (typeof PROJECT_KINDS)[number]

export const PROJECT_LABELS: Record<ProjectKind, { es: string; en: string }> = {
  web: { es: 'Web o tienda virtual', en: 'Web or online store' },
  app: { es: 'Aplicación móvil', en: 'Mobile app' },
  auto: { es: 'Automatización / IA', en: 'Automation / AI' },
  eco: { es: 'Ecosistema completo', en: 'Full ecosystem' },
}

export const localeSchema = z.enum(['es', 'en']).default('es')

const name = z
  .string()
  .trim()
  .min(2, 'El nombre es obligatorio.')
  .max(80, 'El nombre es demasiado largo.')

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('El email no es válido.')
  .max(160, 'El email es demasiado largo.')

export const contactSchema = z.object({
  name,
  email,
  project: z.enum(PROJECT_KINDS, { errorMap: () => ({ message: 'Selecciona un tipo de proyecto.' }) }),
  message: z
    .string()
    .trim()
    .min(10, 'Cuéntanos un poco más del proyecto (mínimo 10 caracteres).')
    .max(2000, 'El mensaje es demasiado largo.'),
  locale: localeSchema,
  /** Campo trampa: los bots lo rellenan, las personas no lo ven. */
  website: z.string().max(0).optional(),
})

export const bookingSchema = z.object({
  name,
  email,
  date: z.string().regex(DATE_RE, 'Fecha inválida.'),
  time: z
    .string()
    .regex(TIME_RE, 'Hora inválida.')
    .refine((t) => (ALL_SLOTS as string[]).includes(t), 'Ese horario no está disponible.'),
  notes: z.string().trim().max(1000, 'Las notas son demasiado largas.').default(''),
  locale: localeSchema,
  website: z.string().max(0).optional(),
})

export const availabilityQuerySchema = z.object({
  date: z.string().regex(DATE_RE, 'Fecha inválida.'),
})

export type ContactInput = z.infer<typeof contactSchema>
export type BookingInput = z.infer<typeof bookingSchema>

/** Primer mensaje de error legible, para devolverlo tal cual al formulario. */
export function firstIssue(err: z.ZodError): string {
  return err.issues[0]?.message ?? 'Datos inválidos.'
}
