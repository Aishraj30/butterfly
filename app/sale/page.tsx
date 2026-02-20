'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CatalogBanner } from '@/components/catalog/CatalogBanner'
import { Pagination } from '@/components/ui/PaginationComponent'

const ITEMS_PER_PAGE = 12

const bannerImages = [
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400048/butterfly-couture/1771400047722-blob.jpg",
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400106/butterfly-couture/1771400105742-blob.jpg",
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400121/butterfly-couture/1771400121271-blob.jpg",
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400157/butterfly-couture/1771400156846-blob.jpg",
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400180/butterfly-couture/1771400180246-blob.jpg"
]

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

export default function SalePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        fetchSaleProducts()
    }, [])

    const fetchSaleProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/products')
            const data = await response.json()

            if (data.success && Array.isArray(data.products)) {
                // Filter products that have onSale flag
                const saleProducts = data.products.filter((p: Product) => p.onSale === true)
                setProducts(saleProducts)
            } else {
                console.error("Unexpected API response format:", data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch sale products:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-white pb-20 w-full">
            {/* Banner Section */}
            <CatalogBanner
                title="SALE"
                subtitle="Limited time offers on premium items"
                backgroundImage={bannerImages[2]}
            />

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                            <p className="text-gray-500">Loading sale items...</p>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-gray-600 text-lg">No sale items available</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="group block"
                                >
                                    <div className="relative overflow-hidden bg-gray-100 mb-4 aspect-square">
                                        <div
                                            className={`w-full h-full ${product.imageUrl ||
                                                'bg-gradient-to-br from-pink-100 to-rose-100'
                                                } flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                                        >
                                            {product.onSale && (
                                                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                                    Sale
                                                </div>
                                            )}
                                        </div>

                                        {/* Add to cart button */}
                                        <button className="absolute bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-black text-left uppercase">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-baseline gap-3">
                                            <p className="text-red-600 font-semibold text-sm">
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

                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(products.length / ITEMS_PER_PAGE)}
                            onPageChange={(page) => {
                                setCurrentPage(page)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="mt-12"
                        />
                    </>
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
