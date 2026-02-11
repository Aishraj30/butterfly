'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-pulse mt-4">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4 border-t border-white/10 pt-4">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/3"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
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
            if (!organized[product.category]) organized[product.category] = {}
            if (!organized[product.category][product.subCategory]) {
                organized[product.category][product.subCategory] = []
            }
            organized[product.category][product.subCategory].push(product)
        })
        setCategories(organized)
    }

    // Body Scroll Lock with sticky background
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.top = `-${window.scrollY}px`
            document.body.style.width = '100%'
        } else {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            window.scrollTo(0, parseInt(document.body.style.top || '0') * -1)
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
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
            {/* Backdrop - Made less opaque (bg-black/20 instead of /40) */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Top Drawer Panel - Made less opaque (bg-black/20 instead of /40) */}
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 z-[101] w-full 
                    bg-black/20 backdrop-blur-2xl 
                    border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]
                    font-sans text-white
                    transition-transform duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                    ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
                style={{ maxHeight: '85vh' }}
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply opacity-50" />

                <div className="relative flex flex-col px-6 md:px-12 py-8 max-h-[85vh] overflow-y-auto scrollbar-hide">

                    {/* 1. Header Row */}
                    <div className="flex items-center justify-between mb-3 pb-4 border-b border-white/10">
                        <h2 className="text-xl tracking-[0.3em] uppercase text-white font-medium drop-shadow-md">
                            Store
                        </h2>
                        <button
                            onClick={onClose}
                            className="group p-2 text-white/60 hover:text-white transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90 drop-shadow-sm" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* 2. Main Grid Content */}
                    <div className="flex-1 pb-12">
                        
                        {/* New Arrivals Row (Index 0) */}
                        <div 
                            className={`mb-4 pb-4 border-b border-white/10 ${getAnimationClass(0)}`}
                            style={getDelayStyle(0)}
                        >
                            <Link href="/new-arrival" onClick={onClose} className="flex items-center justify-between group">
                                <span className="text-sm uppercase tracking-[0.2em] text-white group-hover:opacity-70 transition-opacity">New Arrivals</span>
                                <ArrowRight className="w-4 h-4 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                        </div>

                        {/* Sale Row (Index 1) */}
                        <div 
                            className={`mb-4 pb-4 border-b border-white/10 ${getAnimationClass(1)}`}
                            style={getDelayStyle(1)}
                        >
                            <Link href="/sale" onClick={onClose} className="flex items-center justify-between group">
                                <span className="text-sm uppercase tracking-[0.2em] text-red-400 group-hover:text-red-300 transition-colors">Sale</span>
                                <ArrowRight className="w-4 h-4 text-red-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                        </div>

                        {/* Categories Grid */}
                        {isLoading ? (
                            <CategorySkeleton />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12 mt-8">
                                {Object.entries(categories).map(([category, subCategories], index) => (
                                    <div 
                                        key={category} 
                                        className={`flex flex-col space-y-4 group ${getAnimationClass(index + 2)}`}
                                        style={getDelayStyle(index + 2)}
                                    >
                                        {/* Category Title */}
                                        <Link 
                                            href={`/catalog/${encodeURIComponent(category)}`}
                                            onClick={onClose}
                                            className="inline-block"
                                        >
                                            <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors drop-shadow-sm border-b border-transparent group-hover:border-white/50 pb-1">
                                                {category}
                                            </span>
                                        </Link>

                                        {/* Subcategories List */}
                                        <div className="flex flex-col space-y-2.5">
                                            {Object.keys(subCategories).map((subCategory) => (
                                                <Link
                                                    key={subCategory}
                                                    href={`/catalog/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`}
                                                    onClick={onClose}
                                                    className="text-[11px] uppercase tracking-[0.15em] text-white/50 hover:text-white hover:translate-x-1 transition-all duration-300"
                                                >
                                                    {subCategory}
                                                </Link>
                                            ))}
                                            <Link
                                                href={`/catalog/${encodeURIComponent(category)}`}
                                                onClick={onClose}
                                                className="pt-2 text-[10px] uppercase tracking-[0.1em] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                                            >
                                                View All <ArrowRight className="w-2 h-2" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3. Footer / Login (Delayed last) */}
                    <div 
                        className={`pt-6 border-t border-white/10 flex justify-between items-center ${getAnimationClass(10)}`}
                        style={getDelayStyle(6)}
                    >
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
        </>
    )
}