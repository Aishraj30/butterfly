'use client'

import { getSaleProducts, Product } from '@/lib/products'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SalePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading delay for effect
        const timer = setTimeout(() => {
            setProducts(getSaleProducts())
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <main className="min-h-screen bg-background pt-32">
            {/* Page Header */}
            <div className="bg-secondary/30 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                        Sale Collection
                    </h1>
                    <p className="text-foreground/60 max-w-2xl mx-auto">
                        Exclusive offers on our premium luxury pieces. Limited time only.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-32 bg-secondary rounded mb-4"></div>
                            <p className="text-foreground/60">Loading offers...</p>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-foreground/60">No items currently on sale.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group block"
                            >
                                <div className="relative overflow-hidden bg-secondary rounded-sm aspect-[3/4] mb-4">
                                    {/* Image placeholder or gradient */}
                                    <div className={`w-full h-full ${product.image} transition-transform duration-500 group-hover:scale-105 flex items-center justify-center`}>
                                        <span className="text-foreground/20 font-serif italic">
                                            {product.name}
                                        </span>
                                    </div>

                                    {/* Sale Badge */}
                                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                        Sale
                                    </div>

                                    {/* Quick view overlay potentially */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        {product.rating && (
                                            <div className="flex items-center gap-1 text-amber-500 text-xs">
                                                <span>★</span> {product.rating}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-baseline gap-3">
                                        <p className="text-red-600 font-semibold text-lg">
                                            ${product.salePrice}
                                        </p>
                                        <p className="text-sm text-foreground/40 line-through decoration-foreground/40">
                                            ${product.price}
                                        </p>
                                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                                            {Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)}% OFF
                                        </span>
                                    </div>

                                    <p className="text-sm text-foreground/60">
                                        {product.category}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3 border border-border hover:border-primary hover:text-primary transition-colors duration-300 text-sm tracking-wide uppercase">
                        View All Products
                    </Link>
                </div>
            </div>
        </main>
    )
}
