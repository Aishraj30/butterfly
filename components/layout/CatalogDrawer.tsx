'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// --- Types ---
interface CatalogDrawerProps {
    isOpen: boolean
    onClose: () => void
}

interface Product {
    _id: string
    name: string
    category: string
    subCategory: string
    gender: string
    brand: string
    price: number
}

interface CategoryData {
    [category: string]: {
        [subCategory: string]: Product[]
    }
}

// --- Components ---

const CategorySkeleton = () => (
    <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b border-white/10 pb-2">
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="space-y-1 ml-4">
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/3"></div>
                </div>
            </div>
        ))}
    </div>
)

export function CatalogDrawer({ isOpen, onClose }: CatalogDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth()

    // State
    const [categories, setCategories] = useState<CategoryData>({})
    const [isLoading, setIsLoading] = useState(true)
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])

    // Fetch logic
    useEffect(() => {
        // Only fetch if we haven't already
        if (Object.keys(categories).length === 0) {
            setIsLoading(true)
            fetch('/api/products')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.products) {
                        organizeProductsByCategory(data.products)
                    }
                })
                .catch(error => console.error('Failed to fetch products:', error))
                .finally(() => setIsLoading(false))
        }
    }, [])

    const organizeProductsByCategory = (products: Product[]) => {
        const organized: CategoryData = {}
        products.forEach(product => {
            const category = product.category || 'Uncategorized'
            const subCategory = product.subCategory || 'General'

            if (!organized[category]) organized[category] = {}
            if (!organized[category][subCategory]) {
                organized[category][subCategory] = []
            }
            organized[category][subCategory].push(product)
        })
        setCategories(organized)
    }

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    // Body Scroll Lock - ultra robust version to completely prevent background scrolling
    useEffect(() => {
        const htmlElement = document.documentElement
        const bodyElement = document.body
        
        // Store original styles
        const originalHtmlOverflow = htmlElement.style.overflow
        const originalBodyOverflow = bodyElement.style.overflow
        const originalBodyPosition = bodyElement.style.position
        const originalBodyTop = bodyElement.style.top
        const originalBodyLeft = bodyElement.style.left
        const originalBodyWidth = bodyElement.style.width
        const originalBodyHeight = bodyElement.style.height
        const originalBodyMarginRight = bodyElement.style.marginRight
        
        // Calculate scrollbar width to prevent layout shift
        const getScrollbarWidth = () => {
            // Create a temporary element to measure scrollbar width
            const temp = document.createElement('div')
            temp.style.cssText = 'position: absolute; top: -9999px; width: 100px; height: 100px; overflow: scroll; visibility: hidden;'
            document.body.appendChild(temp)
            const scrollbarWidth = temp.offsetWidth - temp.clientWidth
            document.body.removeChild(temp)
            return scrollbarWidth
        }
        
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY
            const scrollX = window.scrollX
            const scrollbarWidth = getScrollbarWidth()
            
            // Apply comprehensive lock styles with scrollbar compensation
            htmlElement.style.overflow = 'hidden'
            bodyElement.style.position = 'fixed'
            bodyElement.style.top = `-${scrollY}px`
            bodyElement.style.left = `-${scrollX}px`
            bodyElement.style.width = `calc(100vw - ${scrollbarWidth}px)`
            bodyElement.style.height = '100vh'
            bodyElement.style.overflow = 'hidden'
            bodyElement.style.touchAction = 'none'
            bodyElement.style.webkitUserSelect = 'none'
            bodyElement.style.userSelect = 'none'
            bodyElement.style.marginRight = `${scrollbarWidth}px`
            
            // Store scroll positions for restoration
            ;(bodyElement as any).storedScrollY = scrollY
            ;(bodyElement as any).storedScrollX = scrollX
            ;(bodyElement as any).scrollbarWidth = scrollbarWidth
            ;(bodyElement as any).originalStyles = {
                htmlOverflow: originalHtmlOverflow,
                bodyOverflow: originalBodyOverflow,
                bodyPosition: originalBodyPosition,
                bodyTop: originalBodyTop,
                bodyLeft: originalBodyLeft,
                bodyWidth: originalBodyWidth,
                bodyHeight: originalBodyHeight,
                bodyMarginRight: originalBodyMarginRight
            }
        } else {
            // Restore scroll position and styles
            const storedScrollY = (bodyElement as any).storedScrollY || 0
            const storedScrollX = (bodyElement as any).storedScrollX || 0
            const storedStyles = (bodyElement as any).originalStyles || {}
            
            // Restore styles first
            htmlElement.style.overflow = storedStyles.htmlOverflow || ''
            bodyElement.style.position = storedStyles.bodyPosition || ''
            bodyElement.style.top = storedStyles.bodyTop || ''
            bodyElement.style.left = storedStyles.bodyLeft || ''
            bodyElement.style.width = storedStyles.bodyWidth || ''
            bodyElement.style.height = storedStyles.bodyHeight || ''
            bodyElement.style.overflow = storedStyles.bodyOverflow || ''
            bodyElement.style.touchAction = ''
            bodyElement.style.webkitUserSelect = ''
            bodyElement.style.userSelect = ''
            bodyElement.style.marginRight = storedStyles.bodyMarginRight || ''
            
            // Restore scroll position
            window.scrollTo(storedScrollX, storedScrollY)
            
            // Clean up stored data
            delete (bodyElement as any).storedScrollY
            delete (bodyElement as any).storedScrollX
            delete (bodyElement as any).scrollbarWidth
            delete (bodyElement as any).originalStyles
        }
        
        return () => {
            // Ensure cleanup on unmount
            const storedStyles = (bodyElement as any).originalStyles || {}
            htmlElement.style.overflow = storedStyles.htmlOverflow || ''
            bodyElement.style.position = storedStyles.bodyPosition || ''
            bodyElement.style.top = storedStyles.bodyTop || ''
            bodyElement.style.left = storedStyles.bodyLeft || ''
            bodyElement.style.width = storedStyles.bodyWidth || ''
            bodyElement.style.height = storedStyles.bodyHeight || ''
            bodyElement.style.overflow = storedStyles.bodyOverflow || ''
            bodyElement.style.touchAction = ''
            bodyElement.style.webkitUserSelect = ''
            bodyElement.style.userSelect = ''
            bodyElement.style.marginRight = storedStyles.bodyMarginRight || ''
            delete (bodyElement as any).storedScrollY
            delete (bodyElement as any).storedScrollX
            delete (bodyElement as any).scrollbarWidth
            delete (bodyElement as any).originalStyles
        }
    }, [isOpen])

    // Prevent any background scrolling with comprehensive event blocking
    useEffect(() => {
        const preventAllScroll = (e: Event) => {
            if (isOpen) {
                const drawerElement = drawerRef.current
                // Always prevent default and stop propagation for background elements
                if (!drawerElement || !drawerElement.contains(e.target as Node)) {
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    return false
                }
                // For drawer elements, just stop propagation to prevent body scroll
                if (drawerElement && drawerElement.contains(e.target as Node)) {
                    e.stopPropagation()
                }
            }
        }

        const preventWheel = (e: Event) => {
            if (isOpen) {
                const drawerElement = drawerRef.current
                if (!drawerElement || !drawerElement.contains(e.target as Node)) {
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    return false
                }
                // Allow wheel scrolling in drawer but prevent bubbling
                e.stopPropagation()
            }
        }

        const preventTouch = (e: TouchEvent) => {
            if (isOpen) {
                const drawerElement = drawerRef.current
                if (!drawerElement || !drawerElement.contains(e.target as Node)) {
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    return false
                }
            }
        }

        const preventKeyScroll = (e: KeyboardEvent) => {
            if (isOpen && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
                const drawerElement = drawerRef.current
                if (!drawerElement || !drawerElement.contains(e.target as Node)) {
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    return false
                }
            }
        }

        if (isOpen) {
            // Block all possible scroll events with capture phase
            document.addEventListener('wheel', preventWheel as EventListener, { passive: false, capture: true })
            document.addEventListener('mousewheel', preventWheel as EventListener, { passive: false, capture: true })
            document.addEventListener('DOMMouseScroll', preventWheel as EventListener, { passive: false, capture: true })
            document.addEventListener('touchmove', preventTouch, { passive: false, capture: true })
            document.addEventListener('touchstart', preventAllScroll, { passive: false, capture: true })
            document.addEventListener('touchend', preventAllScroll, { passive: false, capture: true })
            document.addEventListener('keydown', preventKeyScroll, { capture: true })
            document.addEventListener('scroll', preventAllScroll, { capture: true })
            
            // Also block on window level
            window.addEventListener('wheel', preventWheel as EventListener, { passive: false, capture: true })
            window.addEventListener('scroll', preventAllScroll, { capture: true })
        }

        return () => {
            // Clean up all event listeners
            document.removeEventListener('wheel', preventWheel as EventListener, { capture: true })
            document.removeEventListener('mousewheel', preventWheel as EventListener, { capture: true })
            document.removeEventListener('DOMMouseScroll', preventWheel as EventListener, { capture: true })
            document.removeEventListener('touchmove', preventTouch, { capture: true })
            document.removeEventListener('touchstart', preventAllScroll, { capture: true })
            document.removeEventListener('touchend', preventAllScroll, { capture: true })
            document.removeEventListener('keydown', preventKeyScroll, { capture: true })
            document.removeEventListener('scroll', preventAllScroll, { capture: true })
            
            window.removeEventListener('wheel', preventWheel as EventListener, { capture: true })
            window.removeEventListener('scroll', preventAllScroll, { capture: true })
        }
    }, [isOpen])

    // --- Animation Helper ---
    const getAnimationClass = (delayIndex: number) => {
        const baseClass = "transform transition-all duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]"
        const activeClass = isOpen && !isLoading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        return `${baseClass} ${activeClass}`
    }
    
    const getDelayStyle = (index: number) => ({ transitionDelay: `${150 + (index * 50)}ms` })

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Left Side Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 z-[101] h-full w-full max-w-[320px] 
                    bg-black/40 backdrop-blur-2xl 
                    border-r border-white/20 shadow-[20px_0_50px_rgba(0,0,0,0.1)]
                    font-sans text-white
                    transition-transform duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply opacity-50" />

                <div className="relative flex h-full flex-col px-6 pt-10 pb-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg tracking-[0.3em] uppercase text-white font-normal drop-shadow-md">
                            Catalog
                        </h2>
                        <button
                            onClick={onClose}
                            className="group p-2 text-white/60 hover:text-white transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90 drop-shadow-sm" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto space-y-1 pr-4" style={{
                        scrollbarWidth: 'none',
                        scrollbarColor: 'transparent transparent',
                        '--webkit-scrollbar': 'none',
                        '--webkit-scrollbar-track': 'transparent',
                        '--webkit-scrollbar-thumb': 'transparent',
                        '--webkit-scrollbar-thumb:hover': 'transparent',
                        msOverflowStyle: 'none'
                    } as React.CSSProperties & {
                        '--webkit-scrollbar'?: string;
                        '--webkit-scrollbar-track'?: string;
                        '--webkit-scrollbar-thumb'?: string;
                        '--webkit-scrollbar-thumb:hover'?: string;
                        msOverflowStyle?: string;
                    }}>
                        
                        {/* New Arrivals */}
                        <Link 
                            href="/new-arrival" 
                            onClick={onClose} 
                            className="flex items-center justify-between py-3 group"
                        >
                            <span className="text-xs font-normal uppercase tracking-[0.2em] text-white group-hover:text-white/90 transition-colors">
                                New Arrivals
                            </span>
                            <ArrowRight className="w-4 h-4 text-white/40 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>

                        {/* Sale */}
                        <Link 
                            href="/sale" 
                            onClick={onClose} 
                            className="flex items-center justify-between py-3 border-b border-white/10 group"
                        >
                            <span className="text-xs font-normal uppercase tracking-[0.2em] text-red-400 group-hover:text-red-300 transition-colors">
                                Sale
                            </span>
                            <ArrowRight className="w-4 h-4 text-red-400/60 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>

                        {/* Categories List */}
                        {isLoading ? (
                            <CategorySkeleton />
                        ) : (
                            <div className="space-y-1">
                                {Object.entries(categories).map(([category, subCategories], index) => {
                                    const isExpanded = expandedCategories.includes(category)
                                    const subCategoryCount = Object.keys(subCategories).length
                                    
                                    return (
                                        <div key={category} className="border-b border-white/10">
                                            {/* Category Header */}
                                            <button
                                                onClick={() => toggleCategory(category)}
                                                        className="w-full flex items-center justify-between py-4 text-left group"
                                            >
                                                <span className="text-xs font-light uppercase tracking-[0.2em] text-white">
                                                    {category}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4 text-white/60 transition-transform duration-300" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-white/60 transition-transform duration-300" />
                                                    )}
                                                </div>
                                            </button>

                                            {/* Subcategories Dropdown */}
                                            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
                                                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
                                                <div className="pb-4 space-y-2">
                                                    {/* View All Link */}
                                                    <Link
                                                        href={`/catalog/${encodeURIComponent(category)}`}
                                                        onClick={onClose}
                                                        className="flex items-center justify-between py-2 px-4 text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
                                                    >
                                                        <span>View All {category}</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                    
                                                    {/* Subcategory Links */}
                                                    {Object.keys(subCategories).map((subCategory) => (
                                                        <Link
                                                            key={subCategory}
                                                            href={`/catalog/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`}
                                                            onClick={onClose}
                                                            className="block py-2 px-4 text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white hover:bg-white/5 rounded transition-colors"
                                                        >
                                                            {subCategory}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-white/10 mt-6">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6">
                                {!user && (
                                    <Link
                                        href="/account"
                                        onClick={onClose}
                                        className="text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors"
                                    >
                                        Log In / Sign Up
                                    </Link>
                                )}
                            </div>
                            <div className="flex gap-2 opacity-50">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}