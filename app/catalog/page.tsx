'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogBanner } from '@/components/catalog/CatalogBanner';
import Link from 'next/link';
import { FilterDrawer, FilterState } from '@/components/layout/FilterDrawer';
import { filterAndSortProducts, FilterOptions, getAllProducts, Product } from '@/lib/products';
import { Sliders } from 'lucide-react';

interface Collection {
    id: number;
    _id: string;
    name: string;
    description?: string;
    categories?: string[];
    productCount?: number;
    products?: Product[];
}

function CatalogContent() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const collectionParam = searchParams.get('collection');

    const allProducts = useMemo(() => getAllProducts(), []);

    const filteredProducts = useMemo(() => {
        if (!collectionParam) return [];

        let options: FilterOptions = {
            categories: [decodeURIComponent(collectionParam)],
        };

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

        return filterAndSortProducts(allProducts, options);
    }, [collectionParam, activeFilters, allProducts]);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            setIsLoading(true);
            const collectionsRes = await fetch('/api/collections');
            const collectionsData = await collectionsRes.json();

            if (collectionsData.success) {
                setCollections(collectionsData.collections || []);
            }
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getPlaceholderImage = (productName: string): string => {
        const gradients = [
            'bg-gradient-to-br from-purple-100 to-pink-100',
            'bg-gradient-to-br from-pink-100 to-rose-100',
            'bg-gradient-to-br from-amber-50 to-orange-100',
            'bg-gradient-to-br from-slate-100 to-gray-100',
            'bg-gradient-to-br from-yellow-100 to-amber-100',
            'bg-gradient-to-br from-orange-50 to-yellow-100',
        ];
        return gradients[productName.length % gradients.length];
    };

    return (
        <main className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
            {/* Banner Section */}
            <CatalogBanner
                title={collectionParam ? decodeURIComponent(collectionParam).toUpperCase() : "CATALOG"}
                subtitle={collectionParam ? `Explore our ${decodeURIComponent(collectionParam)} collection` : "Explore our complete collection"}
                backgroundImage="/banners/b2.JPG"
            />

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {/* Categories/Products Section */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                ) : collectionParam ? (
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link href="/catalog" className="hover:text-black">Catalog</Link>
                            <span>/</span>
                            <span className="text-black font-medium capitalize">{collectionParam}</span>
                        </div>

                        <div className="mb-8 flex justify-between items-center bg-gray-50 p-6">
                            <div className="flex items-center gap-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-black capitalize">
                                        {collectionParam}
                                    </h1>
                                    <p className="text-gray-600 mt-2">
                                        Showing {filteredProducts.length} pieces in {collectionParam} collection
                                    </p>
                                </div>
                                <div className="hidden md:flex items-center gap-3 pl-6 border-l">
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
                                className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex-shrink-0"
                            >
                                <Sliders size={18} />
                                Refine
                            </button>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="text-center">
                                    <p className="text-gray-600 text-lg mb-4">No products found matching your filters</p>
                                    <button
                                        onClick={() => setActiveFilters(null)}
                                        className="inline-flex items-center justify-center px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide uppercase"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                                {filteredProducts.map((product: Product) => (
                                    <Link
                                        href={`/product/${product.id}`}
                                        key={product.id}
                                        className="group block"
                                    >
                                        <div className="relative overflow-hidden bg-[#F9F9F9] mb-4 aspect-[3/4]">
                                            <img
                                                src={product.images?.[0] || product.image || product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                                {product.isNew && (
                                                    <div className="bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                                        NEW
                                                    </div>
                                                )}
                                                {product.onSale && (
                                                    <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                                        SALE
                                                    </div>
                                                )}
                                            </div>
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
                ) : collections.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">No categories found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection: Collection) => (
                            <Link
                                href={`/catalog?collection=${encodeURIComponent(collection.name)}`}
                                key={collection.id}
                                className="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-[#8D7B68] transition-colors cursor-pointer"
                            >
                                {/* Category Image Placeholder */}
                                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                    <div className={`w-full h-full ${getPlaceholderImage(collection.name)} flex items-center justify-center`}>
                                        <div className="text-center">
                                            <div className="text-4xl font-serif text-gray-400 mb-2">
                                                {collection.name.charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Info */}
                                <div className="p-6 bg-white">
                                    <h3 className="text-xl font-serif font-bold text-black mb-2 group-hover:text-[#8D7B68] transition-colors">
                                        {collection.name}
                                    </h3>
                                    {collection.description && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {collection.description}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {collection.productCount || 0} Products
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
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><p className="text-gray-500 animate-pulse uppercase tracking-widest text-xs font-bold">Initializing Catalog...</p></div>}>
            <CatalogContent />
        </Suspense>
    );
}
