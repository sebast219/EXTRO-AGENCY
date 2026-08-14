import { test, expect } from '@playwright/test'

/**
 * Regresiones estructurales: idioma, SEO, seguridad y contenido indexable.
 * Cada caso corresponde a un hallazgo concreto de la auditoría.
 */

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
    const html = await page.content()
    expect(html).toContain('lang="en"')
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
    expect(html).toContain('id="delivery"')
    expect(html).toContain('id="capabilities"')
  })

  test('el JSON-LD de FAQ se emite y es válido', async ({ page }) => {
    await page.goto('/')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const faq = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'FAQPage')
    expect(faq).toBeDefined()
    expect(faq.mainEntity.length).toBeGreaterThan(5)
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
  test('el calendario se puede recorrer con el teclado', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()

    const focused = page.locator('[data-focused="true"]')
    await focused.focus()
    const before = await focused.getAttribute('aria-label')

    await page.keyboard.press('ArrowRight')
    const after = await page.locator('[data-focused="true"]').getAttribute('aria-label')

    expect(after).not.toBe(before)
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
