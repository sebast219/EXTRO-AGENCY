---
type: decision
status: accepted
scope: project
date: 2026-08-20
created: 2026-08-20
updated: 2026-08-20
owner: sebast219
source: auditoría SEO 2026-08 sobre EXTRON-AGENCY; código del repo en el commit ab0b67e
tags: [decision, csp, seo, nextjs, seguridad, rendering]
ai-first: true
---

# ADR-001 · CSP con nonce por request vs. prerenderizado estático

## For future Claude

Esta nota registra **por qué el sitio público de [[EXTRO]] se renderiza por petición
en lugar de prerenderizarse**, y por qué la solución "obvia" (ISR con `revalidate`)
está explícitamente **rechazada por corrección, no solo por gusto**. Si en el futuro
alguien propone poner `export const revalidate = N` en las páginas de `app/(site)/`
para mejorar TTFB, lee primero la sección "Opción A": romperías todos los scripts
del sitio de forma silenciosa e intermitente.

Guardada porque el conflicto entre [[CSP]] con nonce y prerenderizado es
estructural, no un bug: se va a volver a plantear cada vez que alguien mire
Core Web Vitals.

**Confianza y caducidad:**
- Los hechos sobre el repo están verificados por lectura directa del código el
  2026-08-20 (rutas y líneas citadas abajo). Si el código cambió, revalidar.
- La opción B' (SRI de [[Next.js]]) está marcada como **no verificada**: nadie la
  probó contra la documentación oficial ni contra un build real en esa sesión.
- Los pasos 1 a 6 del plan son **plan aprobado, no trabajo hecho**. En la fecha
  de esta nota no se había escrito código todavía.

## Context

Proyecto [[EXTRO]] (`C:\Dev\EXTRON-AGENCY`), [[Next.js]] `^16.3.0` App Router,
desplegado en [[Vercel]]. Hechos verificados por lectura de código el 2026-08-20:

- `proxy.ts:88-98` genera un nonce por petición (`crypto.randomUUID()`) y lo
  inyecta en los **headers de request** (`x-nonce` y `content-security-policy`),
  además de en el header de respuesta (`applySecurityHeaders`, `proxy.ts:126`).
  En [[Next.js]] 16 el fichero de middleware se llama `proxy.ts`.
- Ningún componente de la app lee `x-nonce`: el único consumidor es el renderer de
  [[Next.js]], que extrae `'nonce-…'` del header `content-security-policy` de la
  request y lo estampa en los `<script>` que emite. Verificado por búsqueda: la
  cadena `x-nonce` solo aparece en `proxy.ts:97`.
- La política es `script-src 'self' 'nonce-X' 'strict-dynamic'` (`proxy.ts:30`).
  Con `strict-dynamic` los navegadores modernos **ignoran `'self'`**: sin nonce
  válido no se ejecuta ni un chunk externo ni el bootstrap inline.
- `app/(site)/[lang]/layout.tsx:27` aplica `export const dynamic = 'force-dynamic'`
  a todo el grupo `(site)`: home, blog, blog/[slug], terms. Introducido en el
  commit `78545a5` ("fix: force dynamic rendering so proxy CSP nonce is stamped
  on scripts").
- La auditoría SEO de 2026-08 señala que ese `force-dynamic` global impide SSG/ISR
  y perjudica TTFB, crawl budget y [[Core Web Vitals]].

Hallazgos colaterales encontrados durante la investigación (todos del 2026-08-20):

1. `app/(site)/[lang]/blog/page.tsx:8` y `blog/[slug]/page.tsx:9` declaran
   `export const revalidate = 60`, pero el `force-dynamic` del layout padre fija
   `revalidate = 0` y gana. **Ese ISR es hoy código muerto que documenta una
   intención falsa.**
2. `app/(studio)/studio/[[...index]]/page.tsx:4` es `force-static` y no está bajo
   el layout `(site)`, pero sí recibe CSP con nonce + `strict-dynamic` desde el
   proxy (passthrough, `proxy.ts:7`). Por el mismo mecanismo, [[Sanity Studio]]
   debería estar roto en producción. **Pendiente de verificar.**
3. **Sink de XSS real:** `app/(site)/[lang]/blog/[slug]/page.tsx:151-154` serializa
   a `<script type="application/ld+json">` datos que vienen de [[Sanity]]
   (`post.title`, `post.excerpt`) con `JSON.stringify`, que **no escapa
   `</script>`**. Un editor de Sanity comprometido puede cerrar la etiqueta e
   inyectar un `<script>`. Lo que hoy impide su ejecución es exactamente el
   nonce + `strict-dynamic`: la CSP no es decorativa en las rutas de blog.
4. `lib/content/posts.ts:85,102` hace `sanity.fetch` sin caché de [[Next.js]]
   (`useCdn: true` solo cachea en el CDN de Sanity). Con `force-dynamic`, **cada**
   petición a `/blog` paga un round-trip a Sanity: ese, y no el render de React,
   es el coste dominante de TTFB en blog.

## Problem

El nonce de [[CSP]] solo tiene valor si es **impredecible y distinto por petición**.
El prerenderizado consiste precisamente en **reutilizar un HTML entre peticiones**.
Las dos propiedades son estructuralmente incompatibles dentro del HTML: cualquier
solución tiene que sacar el nonce del HTML cacheado, o aceptar renderizar por
petición.

## Options

### Opción A · ISR (`export const revalidate = N`) — rechazada

Era el punto central a resolver. La respuesta es peor que "el nonce se congela":

1. Con ISR, [[Next.js]] renderiza el HTML en la petición que dispara la
   (re)generación y estampa **el nonce de esa petición** en los `<script>`. Las
   peticiones siguientes reciben ese HTML cacheado, pero `proxy.ts` sigue generando
   el header CSP **por petición**, con un nonce nuevo. Nonce del HTML ≠ nonce del
   header → `strict-dynamic` bloquea el 100% de los scripts durante toda la ventana
   de revalidación. No es una degradación de seguridad: es una **rotura funcional
   intermitente y silenciosa** (solo funciona la petición que regeneró; el HTML SSR
   se ve bien, pero no hay hidratación).
2. La única forma de que ISR + nonce sean coherentes es hacer el nonce constante o
   derivable (por build, por ruta, o cacheando header y body juntos). En ese momento
   el nonce deja de ser impredecible: cualquiera hace `GET` a la página pública, lo
   lee y lo reutiliza en el sink de XSS. **Un nonce compartido y públicamente
   legible es equivalente a `unsafe-inline`, con la complejidad añadida de aparentar
   que no lo es.** Aplica igual a la variante "cachear la respuesta dinámica en el
   CDN con `s-maxage`".

Trade-off honesto: A daría el mejor SEO y la peor relación seguridad/claridad.
Rechazada **por corrección**, antes incluso que por seguridad.

### Opción B · CSP por hashes o `unsafe-inline` con SSG puro — rechazada

App Router emite scripts inline con el payload RSC (`self.__next_f.push(...)`) cuyo
contenido cambia por página y por build: enumerar sus hashes en un header estático
no es mantenible. La alternativa práctica sería volver a
`script-src 'self' 'unsafe-inline'`, que es exactamente el hallazgo **A-4** que la
auditoría de seguridad cerró y que `tests/e2e/site.spec.ts:78` asserta que no vuelva.

**Variante B' (viva, a validar):** [[Next.js]] tiene una opción experimental de
[[SRI]] (`experimental.sri`) que añade `integrity` a los scripts emitidos. Si cubre
también los inline, habilitaría una CSP por hashes compatible con SSG puro y sería
la solución correcta a largo plazo. **No verificado** — requiere un spike contra la
documentación oficial y un build real.

### Opción C · Dynamic solo donde hace falta + inyección del nonce en el edge — parcialmente rechazada

La inyección en edge sobre HTML cacheado no es viable con esta arquitectura: el
proxy de [[Next.js]] (`NextResponse.next()` / `rewrite()`) solo puede mutar
**headers**, no el cuerpo de la respuesta; y el runtime edge de [[Vercel]] no expone
`HTMLRewriter` (específico de Cloudflare Workers). Habría que anteponer una función
edge propia que haga `fetch` del HTML y lo reescriba en streaming: un componente
crítico de seguridad hecho a mano, con un salto de latencia extra y riesgos de
corrección de caché. Coste desproporcionado para un sitio de ~20-30 URLs.

**Se conserva de C la granularidad por ruta:** `force-dynamic` en el layout
compartido es un instrumento romo que ya causa daño colateral (mata el ISR del blog
sin avisar, hallazgo 1).

### Opción D · Mantener el nonce por petición y atacar el coste real de SEO — elegida

Premisa que conviene explicitar antes de pagar seguridad por SEO: de los tres
perjuicios citados por la auditoría, **crawl budget no aplica** a este sitio. La
guía de Google Search Central sobre gestión de crawl budget
(https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget)
está dirigida a sitios grandes, del orden de más de 10.000 URLs (consultada como
referencia de criterio, no reverificada en esta sesión). Aquí hay 2 locales ×
(home, blog, terms, N posts).

Queda **TTFB**, que sí es real (entra en LCP) y es medible y atacable **sin tocar
la CSP**:

- El TTFB dominante en `/blog` y `/blog/[slug]` es el `fetch` a [[Sanity]] por
  petición, no el render (hallazgo 4). Cachear los **datos** — no el HTML — da la
  frescura de ISR sin cachear nonces.
- La home no hace ningún fetch: su render dinámico es CPU pura, del orden de
  decenas de ms. El margen que ISR ganaría ahí es pequeño frente al riesgo asumido.

## Decision

**Opción D**, con el spike de **B' (SRI)** en paralelo. A queda rechazada por
corrección y seguridad; C por complejidad desproporcionada.

Si el spike de B' confirma que se puede emitir una CSP por hashes con SSG, se abre
un ADR sucesor que migre ruta por ruta empezando por `/terms`, y este ADR queda
superseded.

### Plan de implementación (approach aprobado, sin código escrito a fecha de esta nota)

1. **Verificar primero el hallazgo 2** ([[Sanity Studio]] `force-static` bajo CSP con
   nonce). Si el Studio funciona en producción, **parar y reabrir el análisis**:
   significaría que el nonce llega por una vía no modelada aquí.
2. **Sustituir el `force-dynamic` del layout por configuración explícita por ruta.**
   Quitar `app/(site)/[lang]/layout.tsx:27` y declarar el modo en cada `page.tsx` de
   `(site)`. Efecto neto en runtime hoy: ninguno. El valor es que cada ruta declara
   su decisión, el `revalidate = 60` del blog deja de mentir (se elimina o se
   convierte en caché de datos, paso 3) y una ruta futura puede optar a estático sin
   editar el layout de todas. Actualizar el comentario de `layout.tsx:20-26` para que
   explique el conflicto real, no solo la conclusión.
3. **Mover la frescura del HTML a la capa de datos.** En `lib/content/posts.ts`,
   envolver `listPosts` / `getPost` en la caché de datos de [[Next.js]]
   (`unstable_cache` o el mecanismo equivalente de Next 16) con TTL de 60s y tags por
   slug, e invalidar por webhook de [[Sanity]] si se quiere frescura inmediata. Esto
   elimina el round-trip por petición manteniendo render dinámico.
4. **Cerrar el sink de JSON-LD** (hallazgo 3), independientemente de todo lo anterior:
   un serializador que escape `<`, `>` y `&` en `blog/[slug]/page.tsx:151-154` y en
   `app/(site)/[lang]/layout.tsx:154-158`. Deja de depender de la CSP como única línea
   de defensa.
5. **Instrumentar antes de decidir más.** Medir TTFB y LCP reales (Vercel Analytics /
   CrUX) antes y después del paso 3. Solo si tras eso el TTFB sigue siendo el cuello
   de botella se reabre el debate de ceder CSP.
6. **Spike B' (SRI)** en rama aparte: build con la opción experimental activa,
   inspeccionar si los scripts inline llevan `integrity`, y comprobar si una CSP por
   hashes sirve la home estática sin violaciones.

## Consequences

- El sitio público sigue renderizándose por petición. Se acepta conscientemente el
  coste de TTFB del render SSR a cambio de conservar una CSP con nonce real.
- La postura de seguridad del hallazgo **A-4** se mantiene intacta: `strict-dynamic`,
  sin `unsafe-inline` en `script-src`.
- `force-dynamic` deja de estar en un layout compartido: cada ruta declara su modo,
  lo que hace visible cualquier futura regresión y permite migraciones por ruta.
- La frescura del contenido de blog pasa a depender de la caché de datos y de la
  invalidación por webhook, no del ciclo de ISR.
- Se añade una invariante de tests que **hace inviable reintroducir ISR** sobre HTML
  con nonce sin que el CI lo detecte (ver Evidence).
- Coste asumido: cada request de sitio ejecuta una función en [[Vercel]]; el gasto y
  la sensibilidad a cold starts son mayores que con SSG.

### Riesgos y validación

| Riesgo | Validación |
|---|---|
| El paso 2 deja alguna ruta accidentalmente estática → scripts bloqueados en silencio | Test e2e: parsear el HTML servido y afirmar que ningún `<script>` (salvo `application/ld+json`) carece de atributo `nonce`, y que ese nonce **coincide** con el `nonce-…` del header CSP de esa misma respuesta |
| Regresión futura que reintroduzca ISR sobre HTML con nonce | Test e2e: dos peticiones consecutivas a `/` deben devolver nonces **distintos** en header y en HTML. Fija la invariante que hace inviable la opción A |
| Caché no intencionada en el CDN de [[Vercel]] | Assert sobre el header `x-vercel-cache` en las rutas del sitio |
| La CSP se rompe en producción sin que nadie lo note | Añadir `report-to` / `report-uri` con endpoint propio como canario, al menos durante el rollout |
| Los tests existentes de A-4 se relajan al tocar la política | `tests/e2e/site.spec.ts:68-79` ya cubre `strict-dynamic`, presencia de `nonce-` y ausencia de `unsafe-inline`; no debe modificarse en esta línea de trabajo |
| El spike de SRI resulta no aplicable | Es una rama aislada; el coste máximo es el tiempo del spike, D ya cubre el objetivo de SEO |

## Evidence

Ficheros leídos el 2026-08-20 (rutas absolutas):

- `C:\Dev\EXTRON-AGENCY\proxy.ts` — generación del nonce, `buildCsp`, matcher
- `C:\Dev\EXTRON-AGENCY\app\(site)\[lang]\layout.tsx` — `force-dynamic` (línea 27), JSON-LD
- `C:\Dev\EXTRON-AGENCY\app\(site)\[lang]\blog\page.tsx` — `revalidate = 60` inefectivo
- `C:\Dev\EXTRON-AGENCY\app\(site)\[lang]\blog\[slug]\page.tsx` — `revalidate = 60`, sink JSON-LD
- `C:\Dev\EXTRON-AGENCY\app\(studio)\studio\[[...index]]\page.tsx` — `force-static`
- `C:\Dev\EXTRON-AGENCY\lib\content\posts.ts` — fetch a Sanity sin caché de Next
- `C:\Dev\EXTRON-AGENCY\next.config.js` — headers solo para assets estáticos
- `C:\Dev\EXTRON-AGENCY\tests\e2e\site.spec.ts` — aserciones A-4 sobre la CSP

Commits relevantes: `78545a5` (introduce `force-dynamic`), `f81349b` (auditoría A-4,
CSP estricta con nonce).

Referencias externas citadas verbatim:
- Google Search Central, guía de crawl budget para sitios grandes:
  https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget
- Issue de Vercel citado en `next.config.js:14`: https://github.com/vercel/next.js/issues/96646

## Related

- [[CSP]] — concepto: política de seguridad de contenido, nonce, `strict-dynamic`
  *(nota pendiente de crear)*
- [[SEO]] — [[Core Web Vitals]], TTFB, crawl budget *(notas pendientes de crear)*
- [[Next.js]] — App Router, rendering estático vs. dinámico, caché de datos
  *(nota pendiente de crear)*
- [[Sanity]] · [[Sanity Studio]] — CMS del blog y su superficie de confianza
  *(notas pendientes de crear)*
- [[Vercel]] — plataforma de despliegue, runtime edge, CDN *(nota pendiente de crear)*
- [[SRI]] — Subresource Integrity, base de la opción B' *(nota pendiente de crear)*
- [[EXTRO]] — proyecto *(nota pendiente de crear)*
- Código: `proxy.ts`, `app/(site)/[lang]/layout.tsx`, `lib/content/posts.ts` — buscarlos
  en el snapshot del grafo (`brain/vault/20-Code-Graph/`) o con
  `graphify explain "csp nonce"`
