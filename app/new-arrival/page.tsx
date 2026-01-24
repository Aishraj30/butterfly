'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Mock data for new arrivals
const newArrivals = [
    { 
        id: 1, 
        name: 'PREMIUM COTTON BLAZER', 
        price: '$2,900',
        image: 'https://images.unsplash.com/photo-1529139574466-a302c2d56dc6?w=800&q=80',
        category: 'blazers'
    },
    { 
        id: 2, 
        name: 'CLASSIC DENIM JACKET', 
        price: '$1,800',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        category: 'jackets'
    },
    { 
        id: 3, 
        name: 'WOOL OVERCOAT', 
        price: '$4,200',
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
        category: 'coats'
    },
    { 
        id: 4, 
        name: 'SPORTY WINDBREAKER', 
        price: '$950',
        image: 'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=800&q=80',
        category: 'jackets'
    },
    { 
        id: 5, 
        name: 'RASTAH PEACOCK BOMBER', 
        price: '$4,700',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
        category: 'jackets'
    },
    { 
        id: 6, 
        name: 'AK COLLAR TRENCH', 
        price: '$3,200',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
        category: 'coats'
    },
    { 
        id: 7, 
        name: 'OVERSIZED BLUE OVERCOAT', 
        price: '$5,100',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
        category: 'coats'
    },
    { 
        id: 8, 
        name: 'RASTAH 1995 LEATHER', 
        price: '$6,800',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        category: 'jackets'
    },
]

export default function NewArrivalsPage() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <main className="min-h-screen bg-white pt-10 pb-20 w-full">
            {/* Banner Section */}
            <div className="w-full py-16 px-5 text-center bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-serif text-[#8D7B68] italic">
                            Discover
                        </h2>
                        <h3 className="text-2xl md:text-3xl font-sans font-bold text-black uppercase tracking-wider">
                            NEW ARRIVALS
                        </h3>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                            <p className="text-gray-500">Loading new arrivals...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newArrivals.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group block"
                            >
                                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    
                                    {/* New Badge */}
                                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                        New
                                    </div>

                                    {/* Add to cart button */}
                                    <button className="absolute bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="12" y1="8" x2="12" y2="16"/>
                                            <line x1="8" y1="12" x2="16" y2="12"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium text-sm text-black text-left uppercase">
                                        {product.name}
                                    </h3>
                                    <p className="font-medium text-sm text-black text-left">
                                        {product.price}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {product.category}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link href="/catalog" className="inline-flex items-center justify-center px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide uppercase">
                        View All Products
                    </Link>
                </div>
            </div>
        </main>
    )
}
