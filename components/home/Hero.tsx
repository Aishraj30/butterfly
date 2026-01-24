import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

// Local hero image
const HERO_IMAGE = "/hero.JPG"

export function Hero() {
  return (
    <section className="fixed top-0 left-0 h-screen w-full overflow-hidden bg-[#CDA45D] -z-10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Fashion Model"
          fill
          priority
          unoptimized
          className="object-cover object-center opacity-90"
        />
        {/* Gradient Overlay for text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 z-10">
        <span className="text-[10px] tracking-[0.2em] font-medium uppercase">Scroll Down</span>
        <ChevronDown className="animate-bounce" size={20} strokeWidth={1} />
      </div>
    </section>
  )
}
