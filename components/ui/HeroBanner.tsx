'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { Button } from './button'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface HeroBannerProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundImage?: string
  overlayColor?: string
  textColor?: string
  showScrollIndicator?: boolean
  isFirst?: boolean // Add prop to identify if it's the first hero
}

export function HeroBanner({
  title = "BUTTERFLY",
  subtitle = "Discover the latest trends in fashion",
  buttonText = "Shop Now",
  buttonLink = "/catalog",
  backgroundImage = "/hero.JPG",
  overlayColor = "", // Remove overlay by default
  textColor = "text-white",
  showScrollIndicator = true,
  isFirst = false // Default to false
}: HeroBannerProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { y: 0, autoAlpha: 1 },
        {
          y: 500,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${isFirst ? 'h-[110vh] -mt-32 pt-32' : 'h-screen'}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Fashion Background"
          fill
          priority
          unoptimized
          className="object-cover w-full h-full opacity-90"
          style={{ objectPosition: 'center center' }}
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 ${overlayColor}`} />
      </div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 className={`mb-4 text-center font-sans text-5xl font-bold md:text-6xl lg:text-7xl ${textColor}`}>
          {title}
        </h1>
        <p className={`mb-8 text-center text-lg md:text-xl ${textColor} opacity-90`}>
          {subtitle}
        </p>
        {buttonText && buttonLink && (
          <Button asChild className="rounded-full px-8 py-3 text-lg bg-white text-black hover:bg-gray-100">
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        )}
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 z-10">
          <span className="text-[10px] tracking-[0.2em] font-medium uppercase">Scroll Down</span>
          <ChevronDown className="animate-bounce" size={20} strokeWidth={1} />
        </div>
      )}
    </section>
  )
}
