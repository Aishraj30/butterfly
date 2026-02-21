'use client'

import { useEffect, useState } from 'react'
import { ButterflyLoader } from '@/components/ui/ButterflyLoader'

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const hasSeenLoader = localStorage.getItem('hasSeenLoader')

    if (hasSeenLoader) {
      setIsLoading(false)
      setShowContent(true)
      return
    }

    // First time visit flow
    const timer = setTimeout(() => {
      setIsLoading(false)
      setShowContent(true)
      localStorage.setItem('hasSeenLoader', 'true')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Handle body scroll locking while loading
  useEffect(() => {
    if (isLoading && hasMounted) {
      document.documentElement.classList.add('loading-active')
    } else {
      document.documentElement.classList.remove('loading-active')
    }
  }, [isLoading, hasMounted])

  if (!hasMounted) {
    return (
      <>
        <ButterflyLoader isLoading={true} />
        <div style={{ opacity: 0 }}>
          {children}
        </div>
      </>
    )
  }

  return (
    <>
      <ButterflyLoader isLoading={isLoading} />
      <div className={showContent ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}>
        {showContent && children}
      </div>
    </>
  )
}

