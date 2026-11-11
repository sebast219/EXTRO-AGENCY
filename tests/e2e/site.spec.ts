import { test, expect } from '@playwright/test'

/**
 * Regresiones estructurales: idioma, SEO, seguridad y contenido indexable.
 * Cada caso corresponde a un hallazgo concreto de la auditoría.
 *
 * El navegador de Playwright envía `Accept-Language: en-US` por defecto. Desde
 * que el sitio detecta el idioma del dispositivo, eso redirige `/` a `/en` y
 * rompe cualquier aserción escrita para la versión en español. La persona que
 * prueba es un dispositivo en español; la detección de inglés se cubre aparte
 * con la cabecera explícita.
 */
test.use({ locale: 'es-CO' })

test.describe('Idioma y rutas (M-2, M-3)', () => {
  test('la raíz se sirve en español sin prefijo', async ({ page }) => {
    await page.goto('/')
    // Las URLs en español ya estaban indexadas: no deben moverse a /es.
    expect(new URL(page.url()).pathname).toBe('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  })

  test('/en sirve el sitio en inglés desde el servidor', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    // M-2: el inglés debe estar en el HTML inicial, no aparecer tras hidratar.
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Top-tier software')
    const html = await page.content()
    expect(html).toContain('lang="en"')
  })

  test('detecta el idioma del dispositivo y redirige a /en', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'accept-language': 'en-US,en;q=0.9,es;q=0.4' },
      maxRedirects: 0,
    })
    expect(res.status()).toBe(307)
    expect(res.headers()['location']).toMatch(/\/en$/)
  })

  test('la elección manual del selector se respeta en la siguiente visita', async ({ request }) => {
    const res = await request.get('/blog', {
      headers: { cookie: 'extro-lang=en' },
      maxRedirects: 0,
    })
    expect(res.status()).toBe(307)
    expect(res.headers()['location']).toMatch(/\/en\/blog$/)
  })

  test('cada página declara hreflang para ambos idiomas', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('link[hreflang="es"]')).toHaveCount(1)
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1)
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1)
  })

  test('la canónica apunta al idioma que se está viendo', async ({ page }) => {
    await page.goto('/en/blog')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/en\/blog$/
    )
  })
})

test.describe('SEO (M-4, A-7)', () => {
  test('el sitemap incluye los artículos y /terms', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)

    const xml = await res.text()
    expect(xml).toContain('/terms')
    // El sitemap escrito a mano solo tenía dos URLs.
    expect((xml.match(/<url>/g) ?? []).length).toBeGreaterThan(5)
  })

  test('las secciones de marketing llegan en el HTML del servidor', async ({ request }) => {
    // A-7: con ssr:false estos bloques no existían para el crawler.
    const html = await (await request.get('/')).text()
    expect(html).toContain('id="soluciones"')
    expect(html).toContain('id="casos"')
    expect(html).toContain('id="proceso"')
    expect(html).toContain('id="reserva"')
  })

  test('el JSON-LD de FAQ se emite y es válido', async ({ page }) => {
    await page.goto('/')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const faq = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'FAQPage')
    expect(faq).toBeDefined()
    expect(faq.inLanguage).toBe('es')
    expect(faq.mainEntity.length).toBeGreaterThan(5)
  })

  test('el JSON-LD de FAQ cambia de idioma en /en', async ({ page }) => {
    await page.goto('/en')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const faq = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'FAQPage')
    expect(faq).toBeDefined()
    expect(faq.inLanguage).toBe('en')
    expect(faq.mainEntity[0].name).toMatch(/startups|companies/i)
  })
})

test.describe('Seguridad (A-4)', () => {
  test('la CSP se aplica también en el sitio público', async ({ request }) => {
    const res = await request.get('/')
    const csp = res.headers()['content-security-policy']

    // Antes la CSP solo existía en /admin y /studio.
    expect(csp).toBeTruthy()
    expect(csp).toContain("'strict-dynamic'")
    expect(csp).toContain('nonce-')
    // El unsafe-inline en script-src era lo que anulaba la política.
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/)
  })

  test('los encabezados de endurecimiento están presentes', async ({ request }) => {
    const h = (await request.get('/')).headers()
    expect(h['x-content-type-options']).toBe('nosniff')
    expect(h['x-frame-options']).toBe('DENY')
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
  })

  test('las rutas de administración ya no existen', async ({ request }) => {
    for (const path of ['/admin', '/admin/login', '/api/auth/session']) {
      expect((await request.get(path)).status()).toBe(404)
    }
  })
})

test.describe('Accesibilidad (M-10)', () => {
  test('el calendario se puede operar con el teclado', async ({ page }) => {
    await page.goto('/')
    const day = page.locator('#reserva button[data-date]:not([disabled])').first()
    await day.focus()
    await expect(day).toBeFocused()

    const availability = page.waitForResponse((r) => r.url().includes('/api/booking/availability'))
    await page.keyboard.press('Enter')
    await availability

    await expect(page.locator('#reserva button[data-slot]').first()).toBeVisible()
  })

  test('el enlace de salto al contenido existe y funciona', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: /saltar al contenido/i })).toBeFocused()
  })
})

test.describe('Enlaces', () => {
  test('el pie no enlaza a páginas inexistentes', async ({ page, request }) => {
    await page.goto('/')
    const hrefs = await page.locator('footer a[href^="/"]').evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!)
    )

    for (const href of new Set(hrefs)) {
      // /privacy y /sla eran dos 404 en el pie de todas las páginas.
      expect((await request.get(href)).status(), `enlace roto: ${href}`).toBeLessThan(400)
    }
  })
})
