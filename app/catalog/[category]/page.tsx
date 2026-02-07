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
            
            if (data.success && data.products && Array.isArray(data.products)) {
                // Filter products that belong to this category or subcategory
                const categoryProducts = data.products.filter((p: Product) => {
                    const decodedCategoryName = decodeURIComponent(categoryName.toLowerCase())
                    const productCategory = p.category?.toLowerCase()
                    const productSubCategory = p.subcategory?.toLowerCase()
                    
                    return productCategory === decodedCategoryName || productSubCategory === decodedCategoryName
                })
                setProducts(categoryProducts)
            } else {
                console.error('Invalid data structure:', data)
                setProducts([])
            }
        } catch (error) {
            console.error('Failed to fetch category products:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    // Function to get background image based on category
    const getBackgroundImage = (category: string) => {
        const categoryImages: { [key: string]: string } = {
            'clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd168d5?q=80&w=1920&auto=format&fit=crop',
            'accessories': 'https://images.unsplash.com/photo-1524863479825-3d96d5f5a2fb?q=80&w=1920&auto=format&fit=crop',
            'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1920&auto=format&fit=crop',
            'bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c613d?q=80&w=1920&auto=format&fit=crop',
            'jewelry': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1920&auto=format&fit=crop',
            'watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop'
        };
        return categoryImages[category.toLowerCase()] || 'https://images.unsplash.com/photo-1441986300917-64674bd168d5?q=80&w=1920&auto=format&fit=crop';
    }

    return (
        <main className="min-h-screen bg-white w-full">
            {/* Banner Section */}
            <CatalogBanner 
                title={decodeURIComponent(categoryName)}
                subtitle="Explore our collection"
                backgroundImage={getBackgroundImage(categoryName)}
            />

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
                                <div className="relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 mb-4">
                                    {/* Product Image */}
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-lg">
                                        {product.image || product.imageUrl ? (
                                            <img
                                                src={product.image || product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                <span className="text-gray-500 text-sm">No Image</span>
                                            </div>
                                        )}
                                        
                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                                            {product.onSale && (
                                                <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    SALE
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="p-4 space-y-2">
                                        <h3 className="font-medium text-black text-sm uppercase tracking-wide mb-2">
                                            {product.name}
                                        </h3>
                                        
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-black font-semibold text-lg">
                                                ₹{product.salePrice || product.price}
                                            </p>
                                            {product.salePrice && (
                                                <>
                                                    <span className="text-gray-400 line-through text-sm">
                                                        ₹{product.price}
                                                    </span>
                                                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                                                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
