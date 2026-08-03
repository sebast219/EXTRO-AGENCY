import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AmbientGrid from '@/components/AmbientGrid'
import ClientsMarquee from '@/components/ClientsMarquee'
import TeamSection from '@/components/TeamSection'
import ServicesCarousel from '@/components/ServicesCarousel'
import Plans from '@/components/Plans'
import DeliverySystem from '@/components/DeliverySystem'
import Comparison from '@/components/Comparison'
import EngineeringPrinciples from '@/components/EngineeringPrinciples'
import Cases from '@/components/Cases'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import Preloader from '@/components/Preloader'
import ScrollProgress from '@/components/ScrollProgress'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Layer: global ambient ── */}
      <Preloader />
      <ScrollProgress />
      <AmbientGrid />
      <Navbar />

      {/* ── 0-8%:  What is EXTRO? ── */}
      <Hero />

      {/* ── 8-15%: Why believe? ── */}
      <ClientsMarquee />

      {/* ── 15-25%: Why does this exist? ── */}
      <EngineeringPrinciples />

      {/* ── 25-40%: How do they build? — Pinned storytelling ── */}
      <DeliverySystem />

      {/* ── 40-55%: What results? — Scroll gates ── */}
      <Cases />

      {/* ── 55-70%: What can they build? — Progressive cards ── */}
      <ServicesCarousel />

      {/* ── 70-80%: How much? — Narrative journey ── */}
      <Plans />

      {/* ── 80-90%: Why trust? ── */}
      <TeamSection />
      <Comparison />
      <FAQ />

      {/* ── 90-100%: What now? — Settle + CTA ── */}
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  )
}
