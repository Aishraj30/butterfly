'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ArrowRight, Plus, Minus, Search, ShoppingBag } from 'lucide-react'

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

// A simple skeleton loader for the category list
const CategorySkeleton = () => (
    <div className="space-y-6 animate-pulse px-2">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
                <div className="h-6 bg-gray-100 rounded w-1/3"></div>
                <div className="h-4 bg-gray-100 rounded w-4"></div>
            </div>
        ))}
    </div>
)

export function CatalogDrawer({ isOpen, onClose }: CatalogDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)

    // State
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [categories, setCategories] = useState<CategoryData>({})
    const [isLoading, setIsLoading] = useState(true)

    // Fetch logic
    useEffect(() => {
        // Only fetch if we haven't already or if we want to refresh on open (usually once is enough)
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
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

    // Body Scroll Lock
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    // Accordion Toggle
    const toggleExpanded = (key: string) => {
        setExpandedItems(prev =>
            prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
        )
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-md transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 z-[101] h-[100dvh] w-full max-w-[500px] bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-full flex-col">

                    {/* 1. Header Area */}
                    <div className="flex items-center justify-between px-8 pt-8 pb-6 bg-white">
                        <h2 className="text-2xl font-bold tracking-tighter text-black flex gap-2 items-center">
                            <ShoppingBag className="w-6 h-6" />
                            Store<span className="text-gray-400">.</span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="group p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90" />
                        </button>
                    </div>

                    {/* 2. Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-8 pb-10 scrollbar-hide">

                        {/* Search Bar Placeholder */}
                        <div className="relative mb-8 group">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                placeholder="Search collection..."
                                className="w-full border-b border-gray-200 py-3 pl-8 text-sm outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                            />
                        </div>

                        {/* Highlights Section */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <Link
                                href="/new-arrival"
                                onClick={onClose}
                                className="flex flex-col justify-between p-4 bg-gray-50 hover:bg-black group transition-colors duration-300 rounded-xl"
                            >
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 group-hover:text-gray-400">Collection</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-black group-hover:text-white">New Arrivals</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white" />
                                </div>
                            </Link>

                            <Link
                                href="/sale"
                                onClick={onClose}
                                className="flex flex-col justify-between p-4 bg-red-50 hover:bg-red-600 group transition-colors duration-300 rounded-xl"
                            >
                                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 group-hover:text-red-200">Limited</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-red-600 group-hover:text-white">Sale</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white" />
                                </div>
                            </Link>
                        </div>

                        <div className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
                            Categories
                        </div>

                        {/* Main Categories List */}
                        {isLoading ? (
                            <CategorySkeleton />
                        ) : (
                            <div className="space-y-1">
                                {Object.entries(categories).map(([category, subCategories]) => {
                                    const isExpanded = expandedItems.includes(category)

                                    return (
                                        <div key={category} className="group">
                                            <button
                                                onClick={() => toggleExpanded(category)}
                                                className="w-full flex items-center justify-between py-4 text-left group-hover:text-gray-600 transition-colors select-none"
                                            >
                                                <span className="text-lg font-medium text-black tracking-wide">
                                                    {category}
                                                </span>
                                                {isExpanded ? (
                                                    <Minus className="w-5 h-5 text-black" strokeWidth={1.5} />
                                                ) : (
                                                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                                                )}
                                            </button>

                                            {/* Accordion Content */}
                                            <div
                                                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="pl-4 border-l-2 border-gray-100 mb-4 space-y-1 ml-1">
                                                    <Link
                                                        href={`/catalog/${encodeURIComponent(category)}`}
                                                        onClick={onClose}
                                                        className="block py-2 pl-4 text-sm font-semibold text-black hover:text-gray-600 transition-colors"
                                                    >
                                                        Shop All {category}
                                                    </Link>
                                                    {Object.keys(subCategories).map((subCategory) => (
                                                        <Link
                                                            key={subCategory}
                                                            href={`/catalog/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`}
                                                            onClick={onClose}
                                                            className="block py-2 pl-4 text-sm text-gray-500 hover:text-black hover:translate-x-1 transition-all"
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

                    {/* 3. Footer / CTA */}
                    <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                        <Link
                            href="/catalog"
                            onClick={onClose}
                            className="flex w-full items-center justify-center gap-2 bg-black text-white py-4 rounded-full font-medium hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/10"
                        >
                            Browse Full Catalog
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}