import { SITE_URL, absoluteUrl, type Locale } from '@/lib/i18n/config'
import { getFaqItems } from '@/components/home/faq-items'
import { ogImageFor } from '@/lib/seo/social'

/** Stable entity ids: other JSON-LD blocks reference these instead of repeating the entity. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const FOUNDER_ID = `${SITE_URL}/#founder`

/** Square logo, 512x512 (Google asks for at least 112x112). */
export const LOGO_URL = `${SITE_URL}/images/brand/extro-logo-512.png`

const FOUNDER_SAME_AS = [
  'https://github.com/sebast219',
  'https://www.linkedin.com/in/sebastian-yepes-dev/',
]

export function organizationSchema(lang: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'EXTRO',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
    image: LOGO_URL,
    description:
      lang === 'en'
        ? 'EXTRO is a custom software engineering company. Get your project scoped at a fixed price; after delivery, keep evolving it with a monthly plan and steady progress in every phase. Includes 1 to 3 months of post-launch support, depending on project size.'
        : 'EXTRO es una empresa de ingeniería de software a medida. Cotiza tu proyecto con precio fijo; después de la entrega, sigue evolucionándolo con un plan mensual y avances constantes en cada fase. Incluye de 1 a 3 meses de soporte post-entrega según el tamaño del proyecto.',
    email: 'hola@extro.com.co',
    telephone: '+573005865312',
    address: { '@type': 'PostalAddress', addressLocality: 'Medellín', addressCountry: 'CO' },
    areaServed: 'Worldwide',
    founder: {
      '@type': 'Person',
      '@id': FOUNDER_ID,
      name: 'Sebastián Yepes',
      jobTitle: lang === 'en' ? 'Full stack software architect' : 'Arquitecto de software full stack',
      sameAs: FOUNDER_SAME_AS,
    },
    knowsAbout: [
      'Custom software development',
      'MVP development',
      'Marketplaces',
      'Ecommerce',
      'Mobile apps',
      'AI and automation',
      'Cloud infrastructure',
      'Engineering subscription',
    ],
    // Company profiles only (LinkedIn Company, GitHub org...). None exist yet;
    // the founder's personal profiles live in founder.sameAs.
  }
}

export function websiteSchema(lang: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'EXTRO',
    url: SITE_URL,
    inLanguage: lang,
    publisher: { '@id': ORGANIZATION_ID },
  }
}

export function faqSchema(lang: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: getFaqItems(lang).map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function blogPostingSchema(post: { slug: string; title: string; excerpt: string; date: string }, lang: Locale) {
  const url = absoluteUrl(`/blog/${post.slug}`, lang)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: lang,
    url,
    image: `${SITE_URL}${ogImageFor(lang).url}`,
    author: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: 'EXTRO', url: SITE_URL, logo: LOGO_URL },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}
