import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import WhyExtron from '@/components/WhyExtron'
import ServicesCarousel from '@/components/ServicesCarousel'
import ClientsMarquee from '@/components/ClientsMarquee'
import Plans from '@/components/Plans'
import QuoteCalculator from '@/components/QuoteCalculator'
import Process from '@/components/Process'
import Cases from '@/components/Cases'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import Preloader from '@/components/Preloader'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Preloader />
      <Navbar />
      <Hero />
      <Stats />
      <WhyExtron />
      <ServicesCarousel />
      <ClientsMarquee />
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
