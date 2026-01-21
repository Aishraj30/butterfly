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

      {/* Main Content */}
      <div className="relative z-10 h-screen max-w-[1400px] mx-auto px-6 flex flex-col justify-center">

        {/* Hero Text */}
        <div className="max-w-4xl mt-20">
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] text-white tracking-tight text-shadow-sm">
            <span className="block">DISCOVER THE ART OF</span>
            <span className="block">DRESSING UP</span>
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/80">
          <span className="text-[10px] tracking-[0.2em] font-medium uppercase">Scroll Down</span>
          <ChevronDown className="animate-bounce" size={20} strokeWidth={1} />
        </div>
      </div>

      {/* Floating Product Cards */}
      <div className="hidden lg:block absolute right-[8%] top-[50%] transform -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-20">
        {/* Card 1 - Top Right */}
        <div className="absolute top-[8%] right-0 w-[380px] bg-white pointer-events-auto shadow-2xl">
          <div className="flex p-4 gap-4">
            <div className="w-1/2 aspect-[3/4] relative overflow-hidden bg-gray-100">
              <Image
                src="/pic1.jpg"
                alt="Product 1"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-center space-y-2">
              <h3 className="font-serif text-xl text-gray-900 leading-tight">Floral Summer Dress</h3>
              <p className="text-sm text-gray-500 font-medium">IDR 300.000</p>
              <Link href="/product/1" className="inline-block mt-4 text-xs font-bold tracking-widest text-black underline decoration-1 underline-offset-4 hover:text-[#8B5E34]">
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2 - Bottom Right */}
        <div className="absolute bottom-0 right-[20%] w-[380px] bg-white pointer-events-auto shadow-2xl">
          <div className="flex p-4 gap-4 flex-row-reverse">
            <div className="w-1/2 aspect-[3/4] relative overflow-hidden bg-gray-100">
              <Image
                src="/pic2.jpg"
                alt="Product 2"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-center space-y-2 text-right">
              <h3 className="font-serif text-xl text-gray-900 leading-tight">Striped Linen Shirt</h3>
              <p className="text-sm text-gray-500 font-medium">IDR 300.000</p>
              <Link href="/product/2" className="inline-block mt-4 text-xs font-bold tracking-widest text-black underline decoration-1 underline-offset-4 hover:text-[#8B5E34]">
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
