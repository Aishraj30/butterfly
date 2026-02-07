'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CatalogBanner } from '@/components/catalog/CatalogBanner'
import { FilterDrawer, FilterState } from '@/components/layout/FilterDrawer'

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    subCategory: string; // Changed from subcategory to subCategory to match DB schema
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

export default function SubcategoryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [gridView, setGridView] = useState<'3' | '4'>('4')
    const params = useParams()
    const categoryName = params.category as string
    const subcategoryName = params.subcategory as string

    useEffect(() => {
        fetchSubcategoryProducts()
    }, [categoryName, subcategoryName])

    const fetchSubcategoryProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/products')
            const data = await response.json()
            
            if (data.success && data.products && Array.isArray(data.products)) {
                console.log('All products:', data.products)
                console.log('Looking for category:', categoryName, 'subcategory:', subcategoryName)
                
                // Filter products that belong to this specific category and subcategory
                const subcategoryProducts = data.products.filter((p: Product) => {
                    const decodedCategoryName = decodeURIComponent(categoryName.toLowerCase())
                    const decodedSubcategoryName = decodeURIComponent(subcategoryName.toLowerCase())
                    const productCategory = p.category?.toLowerCase()
                    const productSubCategory = p.subCategory?.toLowerCase() // Note: subCategory not subcategory
                    
                    console.log('Product:', p.name, 'category:', productCategory, 'subcategory:', productSubCategory)
                    
                    return productCategory === decodedCategoryName && productSubCategory === decodedSubcategoryName
                })
                console.log('Filtered products:', subcategoryProducts)
                setProducts(subcategoryProducts)
                setFilteredProducts(subcategoryProducts)
            } else {
                console.error('Invalid data structure:', data)
                setProducts([])
            }
        } catch (error) {
            console.error('Failed to fetch subcategory products:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = (filters: FilterState) => {
        let filtered = [...products]

        // Filter by gender
        if (filters.genders.length > 0) {
            filtered = filtered.filter(product => 
                product.gender && filters.genders.includes(product.gender)
            )
        }

        // Filter by size (combine both quick sizes and drawer sizes)
        const allSelectedSizes = [...new Set([...filters.sizes, ...selectedSizes])]
        if (allSelectedSizes.length > 0) {
            filtered = filtered.filter(product => 
                product.size && product.size.some(size => allSelectedSizes.includes(size))
            )
        }

        // Filter by price range
        if (filters.priceRange.min !== null) {
            filtered = filtered.filter(product => 
                (product.salePrice || product.price) >= filters.priceRange.min!
            )
        }
        if (filters.priceRange.max !== null) {
            filtered = filtered.filter(product => 
                (product.salePrice || product.price) <= filters.priceRange.max!
            )
        }

        // Filter by color
        if (filters.colors.length > 0) {
            filtered = filtered.filter(product => 
                product.color && filters.colors.some(color => 
                    product.color.toLowerCase() === color.toLowerCase()
                )
            )
        }

        // Sort products
        switch (filters.sortBy) {
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'price-low':
                filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
                break
            case 'price-high':
                filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
                break
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating)
                break
        }

        setFilteredProducts(filtered)
    }

    // Function to handle quick size selection
    const handleSizeSelect = (size: string) => {
        const newSelectedSizes = selectedSizes.includes(size) 
            ? selectedSizes.filter(s => s !== size) 
            : [...selectedSizes, size]
        setSelectedSizes(newSelectedSizes)
        
        // Apply filters immediately with new sizes
        applyFilters({
            genders: [],
            sizes: newSelectedSizes,
            priceRange: { min: null, max: null },
            colors: [],
            sortBy: 'name'
        })
    }

    // Function to handle FilterDrawer apply
    const handleFilterApply = (filters: FilterState) => {
        // Update quick sizes to match drawer sizes
        setSelectedSizes(filters.sizes)
        applyFilters(filters)
    }

    // Function to get background image based on category and subcategory
    const getBackgroundImage = (category: string, subcategory: string) => {
        // Specific subcategory images - UPDATE THESE URLs TO CHANGE BANNERS
        const subcategoryImages: { [key: string]: string } = {
            'jackets': '/banners/banner.jpeg', // Change this URL
            'coats': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'sweaters': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'hoodies': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'shirts': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'pants': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'jeans': 'https://images.unsplash.com/photo-1542271024958-3ea1813786aeb?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'dresses': 'https://images.unsplash.com/photo-1515372039744-b8e02a7ae8b3?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'skirts': 'https://images.unsplash.com/photo-1583496266101-7f5b9940c8d5?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'handbags': 'https://images.unsplash.com/photo-1553062407-98eeb64c613d?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'backpacks': 'https://images.unsplash.com/photo-1553062407-98eeb64c613d?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'wallets': 'https://images.unsplash.com/photo-1627123424554-42aa04b13b93?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'belts': 'https://images.unsplash.com/photo-1596755094512-f3e82e5fdb87?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'sunglasses': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'rings': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'necklaces': 'https://images.unsplash.com/photo-1599643447855-5f4b8e5d197d?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'earrings': 'https://images.unsplash.com/photo-1573408301185-9cc5a027e9a1?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'bracelets': 'https://images.unsplash.com/photo-1611599544316-02b3c8b8d4b9?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'sneakers': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'boots': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'sandals': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1920&auto=format&fit=crop', // Change this URL
            'formal-shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1920&auto=format&fit=crop' // Change this URL
        };

        // Check for specific subcategory image first
        const subcategoryKey = subcategory.toLowerCase();
        if (subcategoryImages[subcategoryKey]) {
            return subcategoryImages[subcategoryKey];
        }

        // Fallback to category images
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
                title={decodeURIComponent(subcategoryName)}
                backgroundImage={getBackgroundImage(categoryName, subcategoryName)}
            />

            <div className="max-w-[1400px] mx-auto px-5 py-8 relative z-10">
                {/* Filter Bar */}
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    {/* Filter & Sort Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black transition-colors text-sm font-medium"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="21" x2="4" y2="14"/>
                            <line x1="4" y1="10" x2="4" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12" y2="3"/>
                            <line x1="20" y1="21" x2="20" y2="16"/>
                            <line x1="20" y1="12" x2="20" y2="3"/>
                            <circle cx="4" cy="7" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="20" cy="9" r="1"/>
                        </svg>
                        FILTER & SORT
                    </button>

                    {/* Quick Size Filters */}
                    <div className="flex items-center gap-2">
                        {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeSelect(size)}
                                className={`px-4 py-2 border text-sm font-medium transition-colors ${
                                    selectedSizes.includes(size)
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-300 hover:border-black'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    {/* Product Count and Grid View Toggle */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">
                            {filteredProducts.length} Items
                        </span>
                        
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setGridView('3')}
                                className={`p-2 rounded ${gridView === '3' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7"/>
                                    <rect x="14" y="3" width="7" height="7"/>
                                    <rect x="3" y="14" width="7" height="7"/>
                                    <rect x="14" y="14" width="7" height="7"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => setGridView('4')}
                                className={`p-2 rounded ${gridView === '4' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="4" height="4"/>
                                    <rect x="10" y="3" width="4" height="4"/>
                                    <rect x="17" y="3" width="4" height="4"/>
                                    <rect x="3" y="10" width="4" height="4"/>
                                    <rect x="10" y="10" width="4" height="4"/>
                                    <rect x="17" y="10" width="4" height="4"/>
                                    <rect x="3" y="17" width="4" height="4"/>
                                    <rect x="10" y="17" width="4" height="4"/>
                                    <rect x="17" y="17" width="4" height="4"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-gray-600 text-lg mb-4">No products found matching your filters</p>
                            <button
                                onClick={() => {
                                    setFilteredProducts(products)
                                    setIsFilterOpen(true)
                                }}
                                className="inline-flex items-center justify-center px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide uppercase"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`grid gap-8 ${
                        gridView === '3' 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    }`}>
                        {filteredProducts.map((product) => (
                            <Link
                                key={product._id}
                                href={`/product/${product._id}`}
                                className="group block"
                            >
                                <div className="bg-gray-50 rounded-lg overflow-hidden transition-shadow duration-300">
                                    {/* Product Image */}
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
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

                                        {/* Zoom Icon */}
                                        <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8"/>
                                                <path d="m21 21-1.4-1.4-1.4-1.4"/>
                                                <line x1="11" y1="8" x2="11" y2="14"/>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-normal text-xs text-black text-left uppercase mb-2 font-inter">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-black font-normal text-base font-inter">
                                                ₹{product.salePrice || product.price}
                                            </p>
                                            {product.salePrice && (
                                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Drawer */}
            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleFilterApply}
            />
        </main>
    )
}
