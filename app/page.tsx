import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AmbientGrid from '@/components/AmbientGrid'
import ClientsMarquee from '@/components/ClientsMarquee'
import PainPoints from '@/components/PainPoints'
import Cases from '@/components/Cases'
import Plans from '@/components/Plans'
import PricingExplanation from '@/components/PricingExplanation'
import ScopeSection from '@/components/ScopeSection'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import ScrollProgress from '@/components/ScrollProgress'
import { DeliverySystemLazy, ServicesCarouselLazy, QuoteCalculatorLazy } from '@/components/DynamicImports'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://extro.com.co',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cómo funciona la suscripción?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Suscribes al plan. Cada viernes recibes un avance funcional. Tú priorizas qué se construye. Sin permanencia.',
      },
    },
    {
      '@type': 'Question',
      name: '¿$500/mes? ¿Cuántas horas incluye?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No vendemos horas. Vendemos capacidad priorizada de ingeniería. El precio es posible porque eliminamos todo lo que no es código: ventas, gestores, reuniones eternas, propuestas. Recibes avances funcionales cada viernes. El alcance lo defines tú con tu ingeniero.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Quién construye?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ingenieros senior. No contratamos juniors. No tercerizamos. Hablas directo con quien escribe el código y diseña la arquitectura.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Y si no me gusta?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Garantía de 7 días. Devolución total. Después, cada avance del viernes lo revisas. Si algo no va, lo ajustamos sin costo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo cambiar de plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, sin costo. ¿Más velocidad? Subes de plan. ¿Mantenimiento? Bajas. Sin penalización.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Permanencia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Pagas por mes. Cancelas cuando quieras. La mayoría se queda por los resultados.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si necesito más trabajo del incluido?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hablamos. Si el alcance crece, ajustamos el plan o sumamos capacidad temporal sin cambiar tu suscripción base.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Quién es dueño del código?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tú. Todo el código, la base de datos y la infraestructura son tuyos desde el día uno. Sin letra pequeña.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Dónde queda alojado mi proyecto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Donde tú decidas. Normalmente en Vercel, AWS o tu propia nube. Te entregamos acceso completo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Trabajan con empresas que ya tienen equipo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Nos integramos con tu equipo actual. Podemos tomar features específicos o acelerar tu roadmap sin reemplazar a nadie.',
      },
    },
  ],
}

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>
      <ScrollProgress />
      <AmbientGrid />
      <Navbar />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Social proof */}
      <ClientsMarquee />

      {/* 3. Problem → Solution */}
      <PainPoints />

      {/* 4. How it works */}
      <DeliverySystemLazy />

      {/* 5. Case studies */}
      <Cases />

      {/* 6. Capabilities */}
      <ServicesCarouselLazy />

      {/* 7. Plans (upsell post-project) */}
      <Plans />

      {/* 8. How we keep price low */}
      <PricingExplanation />

      {/* 9. What we don't do */}
      <ScopeSection />

      {/* 10. Quote calculator */}
      <QuoteCalculatorLazy />

      {/* 11. FAQ */}
      <FAQ />

      {/* 12. Contact */}
      <Contact />
      <Footer />
      <WhatsAppFloat />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  )
}
