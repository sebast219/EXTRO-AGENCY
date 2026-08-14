import { NextResponse } from 'next/server'
import type { z } from 'zod'
import { MAX_BODY_BYTES, firstIssue } from './contracts'

/** Respuesta de error uniforme para todas las rutas. */
export function fail(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ error: message }, { status, headers })
}

export function ok<T extends object>(payload: T, headers?: Record<string, string>) {
  return NextResponse.json({ ok: true, ...payload }, { headers })
}

/**
 * A-9: lee y valida el cuerpo con límite de tamaño.
 *
 * Ninguna de las rutas anteriores acotaba el cuerpo, así que un POST de varios
 * megabytes se parseaba entero y se reenviaba a Resend.
 */
export async function readJson<S extends z.ZodTypeAny>(
  req: Request,
  schema: S
): Promise<{ ok: true; data: z.infer<S> } | { ok: false; response: NextResponse }> {
  const declared = Number(req.headers.get('content-length') ?? '0')
  if (declared > MAX_BODY_BYTES) {
    return { ok: false, response: fail('La petición es demasiado grande.', 413) }
  }

  const raw = await req.text()
  // content-length puede mentir o faltar; el texto recibido no.
  if (raw.length > MAX_BODY_BYTES) {
    return { ok: false, response: fail('La petición es demasiado grande.', 413) }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, response: fail('Cuerpo de petición inválido.', 400) }
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    return { ok: false, response: fail(firstIssue(result.error), 400) }
  }

  return { ok: true, data: result.data }
}
