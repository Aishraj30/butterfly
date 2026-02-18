'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ButterflyLoader } from '@/components/ui/ButterflyLoader'

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
    }, 2500) // Slightly increased for a better feel of the animation

    // Also hide when page is fully loaded
    if (typeof window !== 'undefined') {
      const handleLoad = () => {
        setTimeout(() => {
          setIsLoading(false)
          setIsInitialLoad(false)
        }, 800)
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

  // Handle route changes
  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [pathname, isInitialLoad])

  // Handle body scroll locking while loading
  useEffect(() => {
    if (isLoading) {
      document.documentElement.classList.add('loading-active')
    } else {
      document.documentElement.classList.remove('loading-active')
    }
    return () => {
      document.documentElement.classList.remove('loading-active')
    }
  }, [isLoading])

  return (
    <>
      <ButterflyLoader isLoading={isLoading} />
      {children}
    </>
  )
}

