/**
 * Slug map of the blog, es <-> en, keyed by a stable post id. Single source of
 * truth: lib/blog-posts.ts reads each post's slugs from here by id (so slugs
 * can never be crossed between posts), and proxy.ts / blog-i18n.ts use this
 * small module instead of importing every post body.
 *
 * A post without `en` is Spanish-only.
 */
export const BLOG_SLUGS = {
  'app-cost': { es: 'cuanto-cuesta-desarrollar-app-colombia', en: 'how-much-does-an-app-cost-in-colombia' },
  'choose-agency': { es: 'elegir-agencia-software-medellin', en: 'how-to-choose-a-software-agency-in-medellin' },
  'smb-software': { es: 'software-pymes-por-que', en: 'why-your-small-business-needs-custom-software' },
  'fixed-price': { es: 'precio-cerrado-vs-horas', en: 'fixed-price-vs-hourly-billing' },
  'sql-latency': { es: 'optimizar-consultas-sql', en: 'optimize-slow-sql-queries' },
  'whatsapp-api': { es: 'whatsapp-api-2026', en: 'whatsapp-business-api-guide-2026' },
  'mvp-7-days': { es: 'mvp-7-dias', en: 'ship-a-working-mvp-in-7-days' },
  'nextjs-vs-astro': { es: 'nextjs-vs-astro', en: 'nextjs-vs-astro' },
  'support-automation': { es: 'automatizar-atencion-cliente', en: 'customer-support-automation-without-losing-the-human-touch' },
} as const

export type BlogSlugEntry = { readonly es: string; readonly en?: string }
