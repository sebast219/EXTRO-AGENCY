import { test, expect } from '@playwright/test'

/**
 * Recorrido crítico: agendar una llamada.
 *
 * Es el único camino de conversión del sitio. Antes de esta suite nada impedía
 * que una edición lo desconectara sin que nadie se enterara — que es
 * exactamente lo que le pasó al cotizador.
 */

test.describe('Agendamiento', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()
  })

  test('el calendario se renderiza con los días navegables', async ({ page }) => {
    const grid = page.getByRole('grid')
    await expect(grid).toBeVisible()
    await expect(grid.getByRole('gridcell').first()).toBeVisible()
  })

  test('seleccionar un día carga los horarios reales del servidor', async ({ page }) => {
    const availability = page.waitForResponse((r) => r.url().includes('/api/booking/availability'))

    // Primer día seleccionable del mes visible.
    await page.getByRole('grid').getByRole('button', { disabled: false }).first().click()

    const res = await availability
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(Array.isArray(body.taken)).toBe(true)

    // Con NEXT_PUBLIC_FOMO_SLOTS=0 no debe ocultarse ningún hueco inventado.
    expect(body.free.length).toBeGreaterThan(0)
  })

  test('el recorrido completo llega a la confirmación', async ({ page }) => {
    await page.getByRole('grid').getByRole('button', { disabled: false }).first().click()
    await page.waitForResponse((r) => r.url().includes('/api/booking/availability'))

    await page.getByRole('button', { name: /^\d{1,2}:\d{2} (AM|PM)$/ }).first().click()

    await page.getByLabel(/nombre|name/i).fill('Cliente de Prueba')
    await page.getByLabel(/email/i).fill('prueba@example.com')

    const booking = page.waitForResponse((r) => r.url().endsWith('/api/booking'))
    await page.getByRole('button', { name: /confirmar|confirm/i }).click()

    expect((await booking).status()).toBe(200)
    await expect(page.getByText(/agendado|booked/i)).toBeVisible({ timeout: 15_000 })
  })

  test('el servidor rechaza una hora que no es un hueco válido', async ({ request }) => {
    const res = await request.post('/api/booking', {
      data: {
        name: 'Prueba',
        email: 'prueba@example.com',
        date: '2099-01-01',
        time: '03:07', // fuera de la rejilla de 15 minutos
        locale: 'es',
      },
    })
    expect(res.status()).toBe(400)
  })

  test('el servidor rechaza una fecha pasada aunque el cliente la envíe', async ({ request }) => {
    const res = await request.post('/api/booking', {
      data: {
        name: 'Prueba',
        email: 'prueba@example.com',
        date: '2020-01-01',
        time: '10:00',
        locale: 'es',
      },
    })
    expect(res.status()).toBe(400)
  })

  test('el campo trampa descarta los bots sin darles señal', async ({ request }) => {
    const res = await request.post('/api/booking', {
      data: {
        name: 'Bot',
        email: 'bot@example.com',
        date: '2099-01-01',
        time: '10:00',
        website: 'https://spam.example',
        locale: 'es',
      },
    })
    // 200 deliberado: un 400 le diría al bot que existe una trampa.
    expect(res.status()).toBe(200)
  })

  test('rechaza un cuerpo desproporcionado', async ({ request }) => {
    const res = await request.post('/api/contact', {
      data: {
        name: 'Prueba',
        email: 'prueba@example.com',
        project: 'web',
        message: 'x'.repeat(200_000),
      },
    })
    expect([400, 413]).toContain(res.status())
  })
})
