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
    </main>
  )
}
