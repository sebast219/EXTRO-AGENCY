import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AmbientGrid from '@/components/AmbientGrid'
import ClientsMarquee from '@/components/ClientsMarquee'
import TeamSection from '@/components/TeamSection'
import ServicesCarousel from '@/components/ServicesCarousel'
import WeeklyBuild from '@/components/WeeklyBuild'
import Plans from '@/components/Plans'
import PricingExplanation from '@/components/PricingExplanation'
import ScopeSection from '@/components/ScopeSection'
import DeliverySystem from '@/components/DeliverySystem'
import WhyExtron from '@/components/WhyExtron'
import Comparison from '@/components/Comparison'
import TechAuthority from '@/components/TechAuthority'
import EngineeringPrinciples from '@/components/EngineeringPrinciples'
import ToolsStack from '@/components/ToolsStack'
import Cases from '@/components/Cases'
import QuoteCalculator from '@/components/QuoteCalculator'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import Preloader from '@/components/Preloader'
import ScrollProgress from '@/components/ScrollProgress'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Preloader />
      <ScrollProgress />
      <AmbientGrid />
      <Navbar />
      <Hero />
      <ClientsMarquee />
      <TeamSection />
      <ServicesCarousel />
      <WeeklyBuild />
      <Plans />
      <PricingExplanation />
      <ScopeSection />
      <DeliverySystem />
      <WhyExtron />
      <Comparison />
      <TechAuthority />
      <EngineeringPrinciples />
      <ToolsStack />
      <Cases />
      <QuoteCalculator />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  )
}
