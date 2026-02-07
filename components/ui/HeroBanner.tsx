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
        { y: 0 },
        {
          y: 500,
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
      <div className="absolute inset-0 z-0 bg-gray-50">
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt="Fashion Background"
              fill
              priority
              unoptimized
              className="object-cover object-top w-full h-full"
              style={{ objectPosition: 'top center' }}
            />
            {/* Darker overlay to ensure text visibility */}
            <div className="absolute inset-0 bg-black/30" />
          </>
        )}
        <div className={`absolute inset-0 ${overlayColor}`} />
      </div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 flex h-full flex-col items-center justify-center p-4">
        <h1 className={`mb-4 text-center font-sans text-5xl font-bold md:text-6xl lg:text-7xl ${backgroundImage ? 'text-white' : 'text-[#003300]'}`}>
          {title}
        </h1>
        <p className={`mb-8 text-center text-base md:text-lg ${backgroundImage ? 'text-white' : 'text-red-800'}`}>
          {subtitle}
        </p>
        {buttonText && buttonLink && (
          <Button asChild className={`rounded-md px-8 py-6 text-lg underline ${backgroundImage ? 'bg-white text-black hover:bg-gray-100' : 'bg-[#003300] text-white hover:bg-[#004400]'}`}>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
