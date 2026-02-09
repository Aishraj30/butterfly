import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CatalogBanner } from '@/components/catalog/CatalogBanner'
import { FilterDrawer, FilterState } from '@/components/layout/FilterDrawer'
import { filterAndSortProducts, FilterOptions, getAllProducts, Product } from '@/lib/products'
import { Sliders } from 'lucide-react'

export default function CategoryPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [activeFilters, setActiveFilters] = useState<FilterState | null>(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const categoryName = params.category as string

    const allProducts = useMemo(() => getAllProducts(), [])

    const filteredProducts = useMemo(() => {
        const decodedCategoryName = decodeURIComponent(categoryName.toLowerCase())

        // Base category filtering
        let options: FilterOptions = {
            categories: [decodedCategoryName],
        }

        if (activeFilters) {
            options = {
                ...options,
                sizes: activeFilters.sizes,
                colors: activeFilters.colors,
                genders: activeFilters.genders,
                priceRange: [
                    Number(activeFilters.priceRange.min) || 0,
                    Number(activeFilters.priceRange.max) || 10000
                ],
                sortBy: activeFilters.sortBy
            }
        }

        return filterAndSortProducts(allProducts, options)
    }, [categoryName, activeFilters, allProducts])

    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(timer)
    }, [categoryName, activeFilters])

    // Function to get background image based on category
    // Function to get background image based on category
    const getBackgroundImage = (category: string) => {
        const categoryImages: { [key: string]: string } = {
            'clothing': '/banners/b1.JPG',
            'accessories': '/banners/b2.JPG',
            'shoes': '/banners/b3.jpg',
            'bags': '/banners/b1.JPG',
            'jewelry': '/banners/b2.JPG',
            'watches': '/banners/b3.jpg',
            'outerwear': '/banners/b1.JPG', // Adding outerwear as it was seen in CatalogBanner example
            'dresses': '/banners/b2.JPG',
            'tops': '/banners/b3.jpg',
            'bottoms': '/banners/b1.JPG'
        };
        const image = categoryImages[category.toLowerCase()] || '/banners/b1.JPG';
        return image;
    }

    return (
        <main className="min-h-screen bg-white w-full">
            {/* Banner Section */}
            <CatalogBanner
                title={decodeURIComponent(categoryName)}
                subtitle="Explore our collection"
                backgroundImage={getBackgroundImage(categoryName)}
            />

            <div className="max-w-[1400px] mx-auto px-5 py-12">
                <div className="mb-12 flex justify-between items-center bg-gray-50 p-8 border-l-4 border-black">
                    <div className="flex items-center gap-10">
                        <div>
                            <h1 className="text-4xl font-serif text-black capitalize tracking-tight">
                                {decodeURIComponent(categoryName)}
                            </h1>
                            <p className="text-gray-500 mt-2 text-sm uppercase tracking-[0.2em]">
                                {filteredProducts.length} Premium Pieces Found
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 pl-10 border-l">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort:</span>
                            <select
                                value={activeFilters?.sortBy || 'name'}
                                onChange={(e) => setActiveFilters(prev => ({
                                    ...prev || { genders: [], sizes: [], colors: [], priceRange: { min: null, max: null }, sortBy: 'name' },
                                    sortBy: e.target.value as any
                                }))}
                                className="text-xs font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer text-black"
                            >
                                <option value="name">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <Sliders size={18} />
                        Filter
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
                                <div className="h-4 bg-gray-100" />
                                <div className="h-4 bg-gray-100 w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <Sliders size={48} strokeWidth={1} className="text-gray-200 mb-6" />
                        <h3 className="text-xl font-serif text-black mb-2">No pieces found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm">
                            Try adjusting your filters to explore more of our luxury catalogue.
                        </p>
                        <button
                            onClick={() => setActiveFilters(null)}
                            className="mt-8 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {filteredProducts.map((product: Product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group block"
                            >
                                <div className="relative overflow-hidden aspect-[3/4] bg-[#F9F9F9] mb-6">
                                    <img
                                        src={product.image || product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {product.onSale && (
                                        <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                            Sale
                                        </div>
                                    )}
                                    {product.isNew && (
                                        <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                            New
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600 transition-colors pr-4">
                                            {product.name}
                                        </h3>
                                        <span className="text-xs font-bold text-black whitespace-nowrap">
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                                        {product.category}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={(filters) => {
                    setActiveFilters(filters)
                    setIsFilterOpen(false)
                }}
                initialFilters={activeFilters || undefined}
            />
        </main>
    )
}
