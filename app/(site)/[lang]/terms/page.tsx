import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, X } from 'lucide-react'
import { getTranslations } from '@/lib/i18n'
import { alternatesFor, isLocale, localizedPath, type Locale } from '@/lib/i18n/config'

/**
 * B-8: esta página decidía el idioma comparando una cadena traducida
 * (`t.scope.label === 'Alcance'`) diecisiete veces. Bastaba retocar esa etiqueta
 * en las traducciones para que la página entera se sirviera en el idioma
 * equivocado. Ahora el idioma viene de la ruta.
 */

const COPY: Record<
  Locale,
  {
    title: string
    updated: string
    back: string
    sections: { heading: string; body: string }[]
    scopeHeading: string
    contactHeading: string
    contactBody: string
  }
> = {
  es: {
    title: 'Términos y condiciones',
    updated: 'Última actualización: 2026. Al contratar nuestros servicios, aceptas los siguientes términos.',
    back: 'Volver al inicio',
    scopeHeading: '1. Alcance de los servicios',
    sections: [
      {
        heading: '2. Precios y pagos',
        body: 'Cada proyecto se cotiza según su alcance con un precio fijo. El pago se realiza por adelantado antes de iniciar el desarrollo. Los planes mensuales se facturan al inicio de cada mes y pueden cancelarse en cualquier momento sin penalización.',
      },
      {
        heading: '3. Propiedad intelectual',
        body: 'Todo el código, la base de datos y la infraestructura desarrollados para tu proyecto son de tu propiedad desde el día uno. EXTRO no retiene ningún derecho sobre el código entregado.',
      },
      {
        heading: '4. Garantía',
        body: 'Ofrecemos una garantía de 7 días desde la entrega final del proyecto. Si no estás satisfecho con el resultado, recibirás un reembolso completo. Los ajustes posteriores a cada entrega semanal se realizan sin costo adicional.',
      },
      {
        heading: '5. Confidencialidad',
        body: 'Toda la información compartida durante el proyecto es tratada como confidencial. No compartimos, vendemos ni divulgamos información de nuestros clientes.',
      },
      {
        heading: '6. Agendamiento de reuniones',
        body: 'Al agendar una llamada compartes tu nombre y correo con el único fin de crear el evento de calendario y enviarte la confirmación. Esos datos no se usan para otra cosa ni se ceden a terceros. Puedes pedir su eliminación escribiendo a hola@extro.com.co.',
      },
    ],
    contactHeading: '7. Contacto',
    contactBody: 'Para cualquier duda sobre estos términos, escríbenos a ',
  },
  en: {
    title: 'Terms and conditions',
    updated: 'Last updated: 2026. By hiring our services, you agree to the following terms.',
    back: 'Back to home',
    scopeHeading: '1. Scope of services',
    sections: [
      {
        heading: '2. Pricing and payments',
        body: 'Each project is quoted based on scope with a fixed price. Payment is made upfront before development begins. Monthly plans are billed at the start of each month and can be cancelled at any time without penalty.',
      },
      {
        heading: '3. Intellectual property',
        body: 'All code, databases, and infrastructure developed for your project are your property from day one. EXTRO retains no rights over the delivered code.',
      },
      {
        heading: '4. Warranty',
        body: "We offer a 7-day warranty from final project delivery. If you're not satisfied with the result, you'll receive a full refund. Adjustments after each weekly delivery are made at no additional cost.",
      },
      {
        heading: '5. Confidentiality',
        body: 'All information shared during the project is treated as confidential. We do not share, sell, or disclose client information.',
      },
      {
        heading: '6. Meeting scheduling',
        body: 'When you book a call you share your name and email for the sole purpose of creating the calendar event and sending you the confirmation. That data is not used for anything else and is never passed to third parties. You can request its deletion at hola@extro.com.co.',
      },
    ],
    contactHeading: '7. Contact',
    contactBody: 'For any questions about these terms, contact us at ',
  },
}

const SCOPE_INTRO: Record<Locale, string> = {
  es: 'EXTRO es un estudio de ingeniería de software. Nuestros servicios se limitan exclusivamente al desarrollo de software, arquitectura, infraestructura y automatización.',
  en: 'EXTRO is a software engineering studio. Our services are exclusively limited to software development, architecture, infrastructure, and automation.',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return {
    title: `${COPY[lang].title} · EXTRO`,
    alternates: alternatesFor('/terms', lang),
    robots: { index: true, follow: true },
  }
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const copy = COPY[lang]
  const t = getTranslations(lang)

  return (
    <main id="main-content" className="min-h-screen bg-white" tabIndex={-1}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href={localizedPath('/', lang)}
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {copy.back}
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-medium text-primary mb-4">{copy.title}</h1>
          <p className="text-secondary max-w-xl">{copy.updated}</p>
        </div>

        <div className="max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">{copy.scopeHeading}</h2>
            <p className="text-secondary mb-4">{SCOPE_INTRO[lang]}</p>

            <h3 className="text-lg font-medium text-primary mb-3">{t.scope.title}</h3>
            <p className="text-secondary mb-4">{t.scope.desc}</p>

            <ul className="grid sm:grid-cols-2 gap-3 mb-4 list-none p-0">
              {t.scope.items.map((item: string) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-lg border border-border"
                >
                  <X size={13} strokeWidth={2} className="shrink-0 text-tertiary" aria-hidden="true" />
                  <span className="text-sm text-secondary">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-secondary italic">{t.scope.footer}</p>
          </section>

          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-primary mb-4">{section.heading}</h2>
              <p className="text-secondary">{section.body}</p>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">{copy.contactHeading}</h2>
            <p className="text-secondary">
              {copy.contactBody}
              <a href="mailto:hola@extro.com.co" className="text-primary underline underline-offset-4">
                hola@extro.com.co
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
