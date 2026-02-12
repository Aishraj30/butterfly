'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ArrowRight, Plus, Minus, Search } from 'lucide-react'
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
    <div className="space-y-8 animate-pulse px-2 mt-8">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                <div className="h-3 bg-white/20 rounded w-4"></div>
            </div>
        ))}
    </div>
)

export function CatalogDrawer({ isOpen, onClose }: CatalogDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth()

    // State
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [categories, setCategories] = useState<CategoryData>({})
    const [isLoading, setIsLoading] = useState(true)

    // Fetch logic
    useEffect(() => {
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

    // Body Scroll Lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
        } else {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
        }
    }, [isOpen])

    const toggleExpanded = (key: string) => {
        setExpandedItems(prev =>
            prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
        )
    }

    return (
        <>
            {/* Backdrop - Significantly lighter */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                // Lighter tint (bg-black/5) and heavier blur (2xl) for contrast
                className={`fixed top-0 left-0 z-[101] h-[100dvh] w-full max-w-[320px] 
                    bg-black/40 backdrop-blur-2xl 
                    border-r border-white/20 shadow-[20px_0_50px_rgba(0,0,0,0.1)]
                    font-sans text-white
                    transition-transform duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Noise/Texture Overlay (Optional - made subtler) */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply opacity-50" />

                <div className="relative flex h-full flex-col px-8 pt-12 pb-8">

                    {/* 1. Header: Minimal & Centered */}
                    <div className="relative flex items-center justify-between mb-12">
                        <div className="w-6" /> 
                        {/* Added drop-shadow to help text pop against lighter glass */}
                        <h2 className="text-xl tracking-[0.3em] uppercase text-white font-medium drop-shadow-md">
                            Store
                        </h2>

                        <button
                            onClick={onClose}
                            className="group text-white/60 hover:text-white transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180 drop-shadow-sm" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* 3. Main Navigation */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/0 scrollbar-track-transparent pr-6 space-y-8" 
                     style={{ scrollbarColor: 'rgba(255, 255, 255, 0.01) transparent' }}>
                        
                        {/* Static Links (New / Sale) */}
                        <div className="space-y-4 pb-8 border-b border-white/10">
                            <Link
                                href="/new-arrival"
                                onClick={onClose}
                                className="flex items-center justify-between group"
                            >
                                <span className="text-sm uppercase tracking-[0.2em] text-white group-hover:opacity-70 transition-opacity drop-shadow-sm">
                                    New Arrivals
                                </span>
                                <ArrowRight className="w-3 h-3 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 drop-shadow-sm" />
                            </Link>
                            
                            <Link
                                href="/sale"
                                onClick={onClose}
                                className="flex items-center justify-between group"
                            >
                                <span className="text-sm uppercase tracking-[0.2em] text-red-500 group-hover:opacity-70 transition-opacity">
                                    Sale
                                </span>
                            </Link>
                        </div>

                        {/* Dynamic Categories */}
                        {isLoading ? (
                            <CategorySkeleton />
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(categories).map(([category, subCategories]) => {
                                    const isExpanded = expandedItems.includes(category)

                                    return (
                                        <div key={category} className="group pb-4 border-b border-white/10">
                                            <button
                                                onClick={() => toggleExpanded(category)}
                                                className="w-full flex items-center justify-between py-1 text-left hover:opacity-60 transition-opacity select-none"
                                            >
                                                <span className="text-sm uppercase tracking-[0.2em] text-white drop-shadow-sm">
                                                    {category}
                                                </span>
                                                {isExpanded ? (
                                                    <Minus className="w-3 h-3 text-white/80 drop-shadow-sm" strokeWidth={1} />
                                                ) : (
                                                    <Plus className="w-3 h-3 text-white/80 drop-shadow-sm" strokeWidth={1} />
                                                )}
                                            </button>

                                            {/* Accordion Content */}
                                            <div
                                                className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
                                                    isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="pt-6 pb-4 pl-2 space-y-4 ml-1 mt-2">
                                                    <Link
                                                        href={`/catalog/${encodeURIComponent(category)}`}
                                                        onClick={onClose}
                                                        className="block text-[12px] uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors font-sans drop-shadow-sm py-2"
                                                    >
                                                        View All
                                                    </Link>
                                                    {Object.keys(subCategories).map((subCategory) => (
                                                        <Link
                                                            key={subCategory}
                                                            href={`/catalog/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`}
                                                            onClick={onClose}
                                                            className="block text-[12px] uppercase tracking-[0.15em] text-white/50 hover:text-white hover:translate-x-1 transition-all font-sans drop-shadow-sm py-2"
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

                    {/* 4. Footer */}
                    <div className="pt-8 border-t border-black/5">
                        {!user && (
                            <Link
                                href="/account"
                                onClick={onClose}
                                className="block text-xs uppercase tracking-[0.15em] text-black/60 hover:text-black transition-colors mb-4 font-sans"
                            >
                                Log In
                            </Link>
                        )}
                        <div className="flex gap-4">
                             {/* Socials or other footer items could go here */}
                             <div className="w-2 h-2 rounded-full bg-black/20"></div>
                             <div className="w-2 h-2 rounded-full bg-black/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}