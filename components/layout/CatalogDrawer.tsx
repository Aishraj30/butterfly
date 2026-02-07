'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ChevronRight, ChevronDown } from 'lucide-react'

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

export function CatalogDrawer({ isOpen, onClose }: CatalogDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<CategoryData>({})

    // Fetch products from backend
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.products) {
                    setProducts(data.products)
                    organizeProductsByCategory(data.products)
                }
            })
            .catch(error => console.error('Failed to fetch products:', error))
    }, [])

    // Organize products by category and subcategory
    const organizeProductsByCategory = (products: Product[]) => {
        const organized: CategoryData = {}
        
        products.forEach(product => {
            if (!organized[product.category]) {
                organized[product.category] = {}
            }
            if (!organized[product.category][product.subCategory]) {
                organized[product.category][product.subCategory] = []
            }
            organized[product.category][product.subCategory].push(product)
        })
        
        setCategories(organized)
    }

    // Prevent body scroll when catalog drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const toggleExpanded = (key: string) => {
        setExpandedItems(prev => 
            prev.includes(key) 
                ? prev.filter(item => item !== key)
                : [...prev, key]
        )
    }

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                ref={backdropRef}
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm cursor-pointer transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 z-[101] h-screen w-full max-w-[480px] bg-white shadow-2xl transition-transform duration-500 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-8 py-6">
                        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-black">
                            Catalog
                        </h2>
                        <button
                            onClick={onClose}
                            className="group rounded-full p-2 transition-colors hover:bg-gray-100 cursor-pointer bg-gray-100"
                        >
                            <X size={24} className="transition-transform duration-300 group-hover:rotate-90 text-black" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="space-y-2">
                            {/* Quick Links */}
                            <Link 
                                href="/new-arrival" 
                                onClick={onClose}
                                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                                <span className="font-medium text-black">New Arrivals</span>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                            </Link>
                            <Link 
                                href="/sale" 
                                onClick={onClose}
                                className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                            >
                                <span className="font-medium text-red-600">Sale</span>
                                <ChevronRight size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
                            </Link>

                            <div className="border-t my-4"></div>

                            {/* Categories with Dropdowns */}
                            {Object.keys(categories).length > 0 && Object.entries(categories).map(([category, subCategories]) => (
                                <div key={category} className="border-b border-gray-100 last:border-b-0">
                                    <button
                                        onClick={() => toggleExpanded(category)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                    >
                                        <span className="font-medium text-black text-left">{category}</span>
                                        <ChevronDown 
                                            size={16} 
                                            className={`text-gray-400 transition-transform duration-300 ${
                                                expandedItems.includes(category) ? 'rotate-180' : ''
                                            }`} 
                                        />
                                    </button>
                                    
                                    {/* Dropdown Subcategories */}
                                    <div className={`overflow-hidden transition-all duration-300 ${
                                        expandedItems.includes(category) ? 'max-h-96' : 'max-h-0'
                                    }`}>
                                        <div className="px-4 pb-4 space-y-2">
                                            <Link
                                                href={`/catalog/${encodeURIComponent(category)}`}
                                                onClick={onClose}
                                                className="block py-2 px-4 text-sm font-medium text-black hover:bg-gray-50 rounded transition-colors"
                                            >
                                                View All {category}
                                            </Link>
                                            {Object.keys(subCategories).map((subCategory) => (
                                                <Link
                                                    key={subCategory}
                                                    href={`/catalog/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`}
                                                    onClick={onClose}
                                                    className="block py-2 px-4 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-colors pl-8"
                                                >
                                                    {subCategory} ({subCategories[subCategory].length})
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* All Products Link */}
                        <div className="mt-8 pt-6 border-t">
                            <Link 
                                href="/catalog" 
                                onClick={onClose}

                                className="block w-full bg-black text-white py-4 text-center font-bold tracking-widest hover:bg-gray-800 transition-colors"

                            >

                                View All Products

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}

