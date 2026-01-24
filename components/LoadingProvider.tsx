'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
// import { ButterflyLoader } from '@/components/ui/ButterflyLoader'

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const pathname = usePathname()

  // Handle initial page load
  useEffect(() => {
    // Initial load - show loader for minimum duration
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsInitialLoad(false)
    }, 2000) // Minimum 2 seconds for animation

    // Also hide when page is fully loaded
    if (typeof window !== 'undefined') {
      const handleLoad = () => {
        setTimeout(() => {
          setIsLoading(false)
          setIsInitialLoad(false)
        }, 500) // Small delay to ensure smooth transition
      }

      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad)
        return () => {
          window.removeEventListener('load', handleLoad)
          clearTimeout(timer)
        }
      }
    }

    return () => clearTimeout(timer)
  }, [])

  // Handle route changes (optional - can be enabled for page transitions)
  useEffect(() => {
    if (!isInitialLoad) {
      // Show loader briefly on route change
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 800) // Shorter duration for route changes

      return () => clearTimeout(timer)
    }
  }, [pathname, isInitialLoad])

  return (
    <>
      {/* <ButterflyLoader isLoading={isLoading} /> */}
      {children}
    </>
  )
}

