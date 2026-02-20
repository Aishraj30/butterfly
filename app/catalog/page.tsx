'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogBanner } from '@/components/catalog/CatalogBanner';
import Link from 'next/link';
import { FilterDrawer, FilterState } from '@/components/layout/FilterDrawer';
import { filterAndSortProducts, FilterOptions, getAllProducts, Product } from '@/lib/products';
import { Sliders } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadMore } from '@/components/ui/LoadMoreComponent';

const ITEMS_PER_PAGE = 12;

const bannerImages = [
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400048/butterfly-couture/1771400047722-blob.jpg",
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400106/butterfly-couture/1771400105742-blob.jpg",
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400121/butterfly-couture/1771400121271-blob.jpg",
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400157/butterfly-couture/1771400156846-blob.jpg",
  "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400180/butterfly-couture/1771400180246-blob.jpg"
];

const SingleColumnIcon = ({ active }: { active: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" fill={active ? "black" : "#D1D5DB"} />
    </svg>
)

const DoubleColumnIcon = ({ active }: { active: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4" width="6" height="16" fill={active ? "black" : "#D1D5DB"} />
        <rect x="13" y="4" width="6" height="16" fill={active ? "black" : "#D1D5DB"} />
    </svg>
)

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
    const [products, setProducts] = useState<Product[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [mobileLayout, setMobileLayout] = useState<'1' | '2'>('2');
    const [activeGender, setActiveGender] = useState<string | null>(null);
    const [gridView, setGridView] = useState<'3' | '4'>('4');
    const [displayedItemCount, setDisplayedItemCount] = useState(ITEMS_PER_PAGE);
    const searchParams = useSearchParams();
    const collectionParam = searchParams.get('collection');

    const allProducts = products;

    const filteredProducts = useMemo(() => {
        const categoryParam = searchParams.get('category');
        const subCategoryParam = searchParams.get('subCategory');
        const collectionParam = searchParams.get('collection');

        if (!categoryParam && !subCategoryParam && !collectionParam && !activeFilters) return products;

        let filtered = [...products];

        // Category filter
        if (categoryParam) {
            const category = decodeURIComponent(categoryParam);
            filtered = filtered.filter(p => 
                p.category === category || 
                p.subCategory === category
            );
        }

        // Sub-Category filter
        if (subCategoryParam) {
            const subCategory = decodeURIComponent(subCategoryParam);
            filtered = filtered.filter(p => p.subCategory === subCategory);
        }

        // Collection filter
        if (collectionParam) {
            const collection = decodeURIComponent(collectionParam);
            filtered = filtered.filter(p => p.collectionName === collection);
        }

        // Apply active filters from FilterDrawer
        if (activeFilters) {
            // Gender filter
            if (activeFilters.genders && activeFilters.genders.length > 0) {
                filtered = filtered.filter(p => 
                    p.gender && activeFilters.genders.includes(p.gender)
                );
            }

            // Size filter
            if (activeFilters.sizes && activeFilters.sizes.length > 0) {
                filtered = filtered.filter(p => 
                    p.size && activeFilters.sizes.some(size => p.size.includes(size))
                );
            }

            // Color filter
            if (activeFilters.colors && activeFilters.colors.length > 0) {
                filtered = filtered.filter(p => 
                    p.color && activeFilters.colors.some(color => 
                        p.color.toLowerCase() === color.toLowerCase()
                    )
                );
            }

            // Price range filter
            if (activeFilters.priceRange.min !== null || activeFilters.priceRange.max !== null) {
                const min = typeof activeFilters.priceRange.min === 'number' ? activeFilters.priceRange.min : (activeFilters.priceRange.min ? parseInt(activeFilters.priceRange.min) : 0);
                const max = typeof activeFilters.priceRange.max === 'number' ? activeFilters.priceRange.max : (activeFilters.priceRange.max ? parseInt(activeFilters.priceRange.max) : Infinity);
                filtered = filtered.filter(p => {
                    const price = p.onSale && p.salePrice ? p.salePrice : p.price;
                    return price >= min && price <= max;
                });
            }

            // Sorting
            const sortBy = activeFilters.sortBy || 'name';
            switch (sortBy) {
                case 'price-low':
                    filtered.sort((a, b) => {
                        const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
                        const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
                        return priceA - priceB;
                    });
                    break;
                case 'price-high':
                    filtered.sort((a, b) => {
                        const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
                        const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
                        return priceB - priceA;
                    });
                    break;
                case 'rating':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case 'name':
                default:
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
        }

        return filtered;
    }, [searchParams, activeFilters, products]);

    // Reset displayed items when filters/search changes
    useEffect(() => {
        setDisplayedItemCount(ITEMS_PER_PAGE);
    }, [searchParams, activeFilters]);

    const hasMoreItems = displayedItemCount < filteredProducts.length;
    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, displayedItemCount);
    }, [filteredProducts, displayedItemCount]);

    useEffect(() => {
        const loadPageData = async () => {
            setIsLoading(true);
            await Promise.all([fetchCollections(), fetchProducts()]);
            setIsLoading(false);
        };
        loadPageData();
    }, []);

    const fetchCollections = async () => {
        try {
            const collectionsRes = await fetch('/api/collections');
            const collectionsData = await collectionsRes.json();
            if (collectionsData.success) {
                setCollections(collectionsData.collections || []);
            }
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleSizeSelect = (size: string) => {
        const newSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size)
            : [...selectedSizes, size];
        setSelectedSizes(newSizes);
        setActiveFilters(prev => ({
            ...prev || { genders: [], sizes: [], colors: [], priceRange: { min: null, max: null }, sortBy: 'name' },
            sizes: newSizes
        }));
    };

    const handleLoadMore = () => {
        setDisplayedItemCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
    };

    const toggleMobileGender = (gender: string) => {
        const newGender = activeGender === gender ? null : gender;
        setActiveGender(newGender);
        setActiveFilters(prev => ({
            ...prev || { genders: [], sizes: [], colors: [], priceRange: { min: null, max: null }, sortBy: 'name' },
            genders: newGender ? [newGender] : []
        }));
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

    const categoryParam = searchParams.get('category');
    const subCategoryParam = searchParams.get('subCategory');



    const getDeterministicBannerImage = (categoryParam?: string | null, subCategoryParam?: string | null, collectionParam?: string | null) => {
        // Create a consistent seed from URL parameters
        const seed = (subCategoryParam || categoryParam || collectionParam || 'catalog') || 'catalog';
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        const index = Math.abs(hash) % bannerImages.length;
        return bannerImages[index];
    };

    const bannerTitle = (
        subCategoryParam ? decodeURIComponent(subCategoryParam) :
            categoryParam ? decodeURIComponent(categoryParam) :
                collectionParam ? decodeURIComponent(collectionParam) :
                    "CATALOG"
    ).toUpperCase();

    const bannerSubtitle =
        subCategoryParam ? `Explore our ${decodeURIComponent(subCategoryParam)} collection` :
            categoryParam ? `Browse through our ${decodeURIComponent(categoryParam)} pieces` :
                collectionParam ? `Discover our ${decodeURIComponent(collectionParam)} collection` :
                    "Explore our complete collection";

    return (
        <main className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
            {/* Banner Section */}
            <CatalogBanner
                topTitle="Discover"
                title={bannerTitle}
                backgroundImage={getDeterministicBannerImage(categoryParam, subCategoryParam, collectionParam)}
            />

            <div className="max-w-[1400px] mx-auto px-5 py-12">
                {/* Categories/Products Section */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                ) : (collectionParam || searchParams.get('category') || searchParams.get('subCategory')) ? (
                    <div className="space-y-4">
                        {/* --- MOBILE FILTER BAR (Top Sticky) --- */}
                        <div className="sticky top-[72px] md:top-[88px] lg:top-[104px] z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between md:hidden shadow-sm -mx-5 mb-6">
                            {/* Item Count */}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                                {filteredProducts.length} Items
                            </span>

                            {/* Gender Toggles */}
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <button
                                    onClick={() => toggleMobileGender('Male')}
                                    className={`transition-colors ${activeGender?.toLowerCase() === 'male' ? 'text-black' : 'text-gray-300'}`}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() => toggleMobileGender('Female')}
                                    className={`transition-colors ${activeGender?.toLowerCase() === 'female' ? 'text-black' : 'text-gray-300'}`}
                                >
                                    Female
                                </button>
                            </div>

                            {/* Layout Toggles */}
                            <div className="flex items-center gap-3">
                                <button onClick={() => setMobileLayout('1')}>
                                    <SingleColumnIcon active={mobileLayout === '1'} />
                                </button>
                                <button onClick={() => setMobileLayout('2')}>
                                    <DoubleColumnIcon active={mobileLayout === '2'} />
                                </button>
                            </div>
                        </div>

                        {/* --- DESKTOP FILTER BAR (Hidden on Mobile) --- */}
                        <div className="hidden md:flex items-center justify-between mb-10 border-b pb-6">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-3 px-6 py-3 border border-gray-200 hover:border-black transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <line x1="4" y1="21" x2="4" y2="14" />
                                    <line x1="4" y1="10" x2="4" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12" y2="3" />
                                    <line x1="20" y1="21" x2="20" y2="16" />
                                    <line x1="20" y1="12" x2="20" y2="3" />
                                    <circle cx="4" cy="7" r="1.5" />
                                    <circle cx="12" cy="5" r="1.5" />
                                    <circle cx="20" cy="9" r="1.5" />
                                </svg>
                                FILTER & SORT
                            </button>

                            <div className="flex items-center gap-2">
                                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeSelect(size)}
                                        className={`px-5 py-2.5 border text-[10px] font-bold transition-all tracking-widest ${selectedSizes.includes(size)
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-gray-200 hover:border-black'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    {filteredProducts.length} Items
                                </span>
                                <div className="flex items-center gap-2 pl-6 border-l border-gray-100">
                                    <button
                                        onClick={() => setGridView('3')}
                                        className={`p-2 transition-colors ${gridView === '3' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                                    </button>
                                    <button
                                        onClick={() => setGridView('4')}
                                        className={`p-2 transition-colors ${gridView === '4' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="4" height="4" /><rect x="10" y="3" width="4" height="4" /><rect x="17" y="3" width="4" height="4" /><rect x="3" y="10" width="4" height="4" /><rect x="10" y="10" width="4" height="4" /><rect x="17" y="10" width="4" height="4" /><rect x="3" y="17" width="4" height="4" /><rect x="10" y="17" width="4" height="4" /><rect x="17" y="17" width="4" height="4" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="flex justify-center items-center py-24">
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm tracking-widest uppercase mb-6">No products found matching your filters</p>
                                    <button
                                        onClick={() => {
                                            setActiveFilters(null);
                                            setSelectedSizes([]);
                                            setActiveGender(null);
                                            setDisplayedItemCount(ITEMS_PER_PAGE); // Reset to initial items count
                                        }}
                                        className="inline-flex items-center justify-center px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`grid ${mobileLayout === '1' ? 'grid-cols-1' : 'grid-cols-2'
                                    } ${gridView === '3' ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-x-6 gap-y-12`}>
                                    {displayedProducts.map((product: Product) => (
                                        <ProductCard key={(product as any)._id || product.id} product={product} />
                                    ))}
                                </div>

                                <LoadMore
                                    onLoadMore={handleLoadMore}
                                    isLoading={false}
                                    hasMore={hasMoreItems}
                                    className="mt-12"
                                />
                            </>
                        )}
                    </div>
                ) : collections.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">No categories found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection: Collection) => (
                            <div
                                key={collection.id}
                                className="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-[#8D7B68] transition-colors cursor-pointer"
                            >
                                <Link href={`/catalog?collection=${encodeURIComponent(collection.name)}`}>
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
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={(filters) => {
                    setActiveFilters(filters)
                    setSelectedSizes(filters.sizes)
                    if (filters.genders.length === 1) {
                        setActiveGender(filters.genders[0])
                    } else {
                        setActiveGender(null)
                    }
                    setIsFilterOpen(false)
                }}
                onClearFilters={() => {
                    setActiveFilters(null);
                    setSelectedSizes([]);
                    setActiveGender(null);
                    setDisplayedItemCount(ITEMS_PER_PAGE);
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
