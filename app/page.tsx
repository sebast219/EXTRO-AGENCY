import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import WhyExtron from '@/components/WhyExtron'
import Services from '@/components/Services'
import Plans from '@/components/Plans'
import QuoteCalculator from '@/components/QuoteCalculator'
import Process from '@/components/Process'
import Cases from '@/components/Cases'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <WhyExtron />
      <Services />
      <Plans />
      <QuoteCalculator />
      <Process />
      <Cases />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  )
}
