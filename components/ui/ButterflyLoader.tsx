'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

interface ButterflyLoaderProps {
  isLoading?: boolean
  onComplete?: () => void
  className?: string
}

export function ButterflyLoader({ isLoading = true, onComplete, className }: ButterflyLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [isVisible, setIsVisible] = useState(isLoading)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Butterfly SVG paths - Exact match to the reference image (Non-overlapping wings)
  const paths = [
    // Body - Clean capsule/pill shape
    { d: 'M 97 75 C 97 68 103 68 103 75 L 103 155 C 103 162 97 162 97 155 Z', id: 'body' },
    
    // Left side
    // Left Upper Wing - Large, expansive rounded shape
    { d: 'M 97 85 C 60 40 10 60 15 105 C 20 135 60 140 97 122', id: 'left-upper' },
    // Left Lower Wing - Smaller, very rounded lower wing
    { d: 'M 97 122 C 60 135 35 150 40 175 C 45 200 85 200 97 165', id: 'left-lower' },
    
    // Right side (Mirrored)
    // Right Upper Wing
    { d: 'M 103 85 C 140 40 190 60 185 105 C 180 135 140 140 103 122', id: 'right-upper' },
    // Right Lower Wing
    { d: 'M 103 122 C 140 135 165 150 160 175 C 155 200 115 200 103 165', id: 'right-lower' },
    
    // Antennae - Simple elegant outward curves
    { d: 'M 99 75 C 95 60 90 50 82 40', id: 'left-antenna' },
    { d: 'M 101 75 C 105 60 110 50 118 40', id: 'right-antenna' },
  ]

  useGSAP(
    () => {
      if (!svgRef.current || !isLoading) return

      const svgPaths = svgRef.current.querySelectorAll('path')
      
      // Set initial state - paths are invisible
      svgPaths.forEach((path) => {
        const length = path.getTotalLength()
        path.style.strokeDasharray = `${length}`
        path.style.strokeDashoffset = `${length}`
        path.style.opacity = '1'
      })

      // If reduced motion is preferred, show immediately without animation
      if (prefersReducedMotion) {
        svgPaths.forEach((path) => {
          path.style.strokeDashoffset = '0'
        })
        return
      }

      // Create timeline for drawing animation
      const tl = gsap.timeline()

      // Animate each path in sequence
      svgPaths.forEach((path, index) => {
        const length = path.getTotalLength()
        tl.to(path, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, index * 0.15) // Stagger the animations
      })

      // Optional: Add subtle wing flutter after drawing
      tl.to(svgRef.current.querySelectorAll('#left-upper, #right-upper'), {
        transform: 'scaleY(1.05)',
        transformOrigin: 'center',
        duration: 0.3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
      }, '-=0.2')

    },
    { scope: containerRef, dependencies: [isLoading] }
  )

  // Handle fade out when loading completes
  useEffect(() => {
    if (!isLoading && isVisible) {
      const duration = prefersReducedMotion ? 0.1 : 0.5
      const fadeOut = gsap.to(containerRef.current, {
        opacity: 0,
        duration,
        ease: 'power2.in',
        onComplete: () => {
          setIsVisible(false)
          onComplete?.()
        },
      })

      return () => {
        fadeOut.kill()
      }
    }
  }, [isLoading, isVisible, onComplete])

  // Handle fade in when loading starts
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true)
      const duration = prefersReducedMotion ? 0.1 : 0.3
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration, ease: 'power2.out' }
      )
    }
  }, [isLoading])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center',
        'bg-background/95 backdrop-blur-sm',
        'transition-opacity duration-300',
        className
      )}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="relative will-change-transform">
        <svg
          ref={svgRef}
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
          aria-hidden="true"
          style={{ 
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))',
          }}
        >
          {paths.map((path) => (
            <path
              key={path.id}
              id={path.id}
              d={path.d}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              style={{ 
                willChange: 'stroke-dashoffset',
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

