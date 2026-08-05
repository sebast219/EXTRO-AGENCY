'use client'

import dynamic from 'next/dynamic'

const DeliverySystemLazy = dynamic(
  () => import('@/components/DeliverySystem'),
  {
    loading: () => (
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-24 bg-surface rounded" />
          <div className="h-9 w-80 bg-surface rounded" />
          <div className="h-5 w-96 bg-surface rounded" />
          <div className="h-1 bg-surface rounded-full mt-16" />
          <div className="grid grid-cols-5 gap-3 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-surface rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    ),
    ssr: false,
  }
)

const ServicesCarouselLazy = dynamic(
  () => import('@/components/ServicesCarousel'),
  {
    loading: () => (
      <section className="py-32 px-6 max-w-full mx-auto">
        <div className="animate-pulse space-y-4 max-w-5xl mx-auto">
          <div className="h-3 w-32 bg-surface rounded" />
          <div className="h-9 w-96 bg-surface rounded" />
          <div className="h-5 w-80 bg-surface rounded" />
          <div className="flex gap-5 mt-8 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[380px] h-[300px] bg-surface rounded-xl shrink-0" />
            ))}
          </div>
        </div>
      </section>
    ),
    ssr: false,
  }
)

const QuoteCalculatorLazy = dynamic(
  () => import('@/components/QuoteCalculator'),
  {
    loading: () => (
      <section className="py-32 px-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-20 bg-surface rounded" />
          <div className="h-9 w-72 bg-surface rounded" />
          <div className="h-5 w-80 bg-surface rounded" />
          <div className="h-64 bg-surface rounded-xl mt-8" />
        </div>
      </section>
    ),
    ssr: false,
  }
)

export { DeliverySystemLazy, ServicesCarouselLazy, QuoteCalculatorLazy }
