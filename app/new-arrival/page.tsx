'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CatalogBanner } from '@/components/catalog/CatalogBanner'

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    color: string;
    gender?: string;
    size: string[];
    rating: number;
    reviews: number;
    image?: string;
    imageUrl?: string;
    inStock: boolean;
    onSale?: boolean;
    salePrice?: number;
    isNew?: boolean;
}

export default function NewArrivalsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNewArrivals()
    }, [])

    const fetchNewArrivals = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/products')
            const data = await response.json()
            
            if (data.success) {
                // Filter products that have isNew flag
                const newProducts = data.data.filter((p: Product) => p.isNew === true)
                setProducts(newProducts)
            }
        } catch (error) {
            console.error('Failed to fetch new arrivals:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-white pt-10 pb-20 w-full">
            {/* Banner Section */}
            <CatalogBanner />

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                            <p className="text-gray-500">Loading new arrivals...</p>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-gray-600 text-lg">No new arrivals yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group block"
                            >
                                <div className="relative overflow-hidden bg-gray-100 mb-4 aspect-square">
                                    <div
                                        className={`w-full h-full ${
                                            product.imageUrl || 
                                            'bg-gradient-to-br from-purple-100 to-pink-100'
                                        } flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                                    >
                                        {product.isNew && (
                                            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                                New
                                            </div>
                                        )}
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
                                        ₹{product.price}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-black">
                                            {product.rating}★
                                        </span>
                                        <span className="text-xs text-gray-600">
                                            ({product.reviews} reviews)
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {product.color}
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
