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
  const imageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Common scroll parallax effect
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

      // Entrance animation - for ALL hero banners when they scroll into view
      if (imageRef.current && textRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%", // Animation starts when top of banner hits 90% of viewport (entered 10%)
            end: "bottom top",
            toggleActions: "play none none reverse" // Replays when scrolling back up
          }
        });

        // Initial states
        gsap.set(imageRef.current, { scale: 1.2, opacity: 0 });
        gsap.set(textRef.current, { y: 100, opacity: 0 });

        // Animation sequence
        tl.to(imageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out"
        })
          .to(textRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
          }, 0.2); // Start text animation 0.2s after image starts (absolute time)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${isFirst ? 'h-[110vh] -mt-32 pt-32' : 'h-screen'}`}
    >
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 z-0 bg-gray-50">
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
        <h1 className={`mb-4 text-center font-birds text-5xl font-normal tracking-wide md:text-6xl lg:text-7xl ${backgroundImage ? 'text-white' : 'text-[#003300]'} capitalize`}>
          {title.toLowerCase()}
        </h1>
        <p className={`mb-8 text-center text-base md:text-lg ${backgroundImage ? 'text-white' : 'text-red-800'}`}>
          {subtitle}
        </p>
        {buttonText && buttonLink && (
          <Button asChild className={`rounded-md px-6 py-3 text-sm ${backgroundImage ? 'bg-white text-black hover:bg-gray-100' : 'bg-[#003300] text-white hover:bg-[#004400]'}`}>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
