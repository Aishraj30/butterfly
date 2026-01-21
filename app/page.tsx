import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { LookBook } from '@/components/home/LookBook'
import { NewArrivals } from '@/components/home/NewArrivals'
import { BestOutfit } from '@/components/home/BestOutfit'
import { ServiceFeatures } from '@/components/home/ServiceFeatures'
import { VideoBanner } from '@/components/home/VideoBanner'
import { Reviews } from '@/components/home/Reviews'

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="relative z-10 bg-background mt-[100vh]">
        <LookBook />
        <NewArrivals />
        <BestOutfit />
        <ServiceFeatures />
        <VideoBanner />
        <Reviews />
      </div>
    </main>
  )
}
