'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CatalogBanner } from '@/components/catalog/CatalogBanner'

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    subcategory?: string;
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

export default function CategoryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const categoryName = params.category as string

    useEffect(() => {
        fetchCategoryProducts()
    }, [categoryName])

    const fetchCategoryProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/products')
            const data = await response.json()
            
            if (data.success) {
                // Filter products that belong to this specific subcategory
                const categoryProducts = data.data.filter((p: Product) => 
                    p.subcategory?.toLowerCase() === categoryName.toLowerCase()
                )
                setProducts(categoryProducts)
            }
        } catch (error) {
            console.error('Failed to fetch category products:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-white pt-10 pb-20 w-full">
            {/* Banner Section */}
            <CatalogBanner />

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black capitalize">
                        {decodeURIComponent(categoryName)}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Showing products in {decodeURIComponent(categoryName)} category
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-gray-600 text-lg mb-4">No products found in this category</p>
                            <Link 
                                href="/catalog" 
                                className="inline-flex items-center justify-center px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide uppercase"
                            >
                                Back to Categories
                            </Link>
                        </div>
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
                                            'bg-gradient-to-br from-pink-100 to-rose-100'
                                        } flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                                    >
                                        {product.onSale && (
                                            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                                Sale
                                            </div>
                                        )}
                                        {product.isNew && (
                                            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
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
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-black font-semibold text-sm">
                                            ₹{product.salePrice || product.price}
                                        </p>
                                        {product.salePrice && (
                                            <>
                                                <p className="text-xs text-gray-400 line-through decoration-gray-400">
                                                    ₹{product.price}
                                                </p>
                                                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                                                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
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
            </div>
        </main>
    )
}
