import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br from-muted/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-tr from-accent/5 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="text-xs font-semibold text-accent uppercase tracking-widest bg-accent/10 px-4 py-2 rounded-full">
              New Collection 2024
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-tight">
            Elegance Redefined
          </h1>

          {/* Subheading */}
          <p className="font-light text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            Discover our exquisite collection of butterfly-inspired luxury fashion. 
            Where sophistication meets artistry in every stitch.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors gap-2"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/collection"
              className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-medium rounded-sm hover:bg-primary/5 transition-colors"
            >
              View Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-primary/40 animate-bounce">
          <span className="text-xs uppercase tracking-widest font-semibold">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
