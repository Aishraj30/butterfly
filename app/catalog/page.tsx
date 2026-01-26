'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterDrawer, FilterState } from '@/components/layout/FilterDrawer';
import { CatalogBanner } from '@/components/catalog/CatalogBanner';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

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
}

interface Collection {
    id: number;
    name: string;
    description?: string;
    categories?: string[];
    productCount?: number;
}

export default function CatalogPage() {
    const searchParams = useSearchParams();
    const collectionParam = searchParams?.get('collection');
    
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [layout, setLayout] = useState('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedCollections, setExpandedCollections] = useState<number[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        genders: [],
        sizes: [],
        priceRange: { min: null, max: null },
        colors: [],
        sortBy: 'name'
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // If collection parameter is present, expand only that collection
        if (collectionParam && collections.length > 0) {
            const collection = collections.find(c => c.name === collectionParam);
            if (collection) {
                setExpandedCollections([collection.id]);
            }
        }
    }, [collectionParam, collections]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [productsRes, collectionsRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/collections'),
            ]);

            const productsData = await productsRes.json();
            const collectionsData = await collectionsRes.json();

            if (productsData.success) {
                setProducts(productsData.data);
                setFilteredProducts(productsData.data);
            }
            if (collectionsData.success) {
                setCollections(collectionsData.data);
                if (collectionsData.data.length > 0 && !collectionParam) {
                    setExpandedCollections([collectionsData.data[0].id]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = (filters: FilterState) => {
        setActiveFilters(filters);
        applyAllFilters({ ...filters, sizes: filters.sizes.concat(selectedSizes) });
    };

    const handleTopSizeSelect = (size: string) => {
        const newSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size)
            : [...selectedSizes, size];
        setSelectedSizes(newSizes);
        applyAllFilters({ ...activeFilters, sizes: newSizes.concat(activeFilters.sizes) });
    };

    const applyAllFilters = (filters: FilterState) => {
        let filtered = [...products];

        // Apply gender filter
        if (filters.genders.length > 0) {
            filtered = filtered.filter(p => 
                filters.genders.includes(p.gender || 'Unisex')
            );
        }

        // Apply size filter
        if (filters.sizes.length > 0) {
            filtered = filtered.filter(p => 
                filters.sizes.some(size => p.size.includes(size))
            );
        }

        // Apply price filter
        if (filters.priceRange.min !== null) {
            filtered = filtered.filter(p => p.price >= filters.priceRange.min!);
        }
        if (filters.priceRange.max !== null) {
            filtered = filtered.filter(p => p.price <= filters.priceRange.max!);
        }

        // Apply color filter
        if (filters.colors.length > 0) {
            filtered = filtered.filter(p => 
                filters.colors.includes(p.color)
            );
        }

        // Apply sorting
        switch (filters.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
            default:
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        setFilteredProducts(filtered);
    };

    const toggleCollection = (collectionId: number) => {
        setExpandedCollections((prev) =>
            prev.includes(collectionId)
                ? prev.filter((id) => id !== collectionId)
                : [...prev, collectionId]
        );
    };

    const getProductsByCollection = (collection: Collection): Product[] => {
        if (!collection.categories) return [];
        return filteredProducts.filter((p) => collection.categories?.includes(p.category));
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
            <CatalogBanner />

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-10 pb-6">
                    <div className="flex items-center gap-5">
                        <span className="text-base font-medium text-black">
                            {filteredProducts.length} Items
                        </span>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="text-sm font-medium underline flex items-center gap-2 text-black cursor-pointer hover:opacity-70"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            FILTER & SORT
                        </button>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="text-sm text-gray-600">
                            <span className="px-2 cursor-pointer hover:text-black transition-colors">Male</span>
                            <span className="px-2 cursor-pointer hover:text-black transition-colors">Female</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex border border-[#8D7B68]">
                            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                <button
                                    key={size}
                                    className={`w-9 h-9 text-xs font-medium border-r last:border-r-0 transition-colors cursor-pointer ${
                                        selectedSizes.includes(size)
                                            ? 'bg-[#8D7B68] text-white border-[#8D7B68]'
                                            : 'bg-transparent text-black border-[#8D7B68] hover:bg-[#8D7B68] hover:text-white'
                                    }`}
                                    onClick={() => handleTopSizeSelect(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-0">
                            <button
                                className={`p-2 border-r transition-colors cursor-pointer ${
                                    layout === 'grid'
                                        ? 'bg-[#8D7B68] text-white border-[#8D7B68]'
                                        : 'bg-transparent text-black border-[#8D7B68] hover:bg-[#8D7B68] hover:text-white'
                                }`}
                                onClick={() => setLayout('grid')}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <rect x="1" y="1" width="6" height="6" />
                                    <rect x="9" y="1" width="6" height="6" />
                                    <rect x="1" y="9" width="6" height="6" />
                                    <rect x="9" y="9" width="6" height="6" />
                                </svg>
                            </button>
                            <button
                                className={`p-2 transition-colors cursor-pointer ${
                                    layout === 'list'
                                        ? 'bg-[#8D7B68] text-white border-[#8D7B68]'
                                        : 'bg-transparent text-black border-[#8D7B68] hover:bg-[#8D7B68] hover:text-white'
                                }`}
                                onClick={() => setLayout('list')}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="2" width="14" height="5" />
                                    <rect x="1" y="9" width="14" height="5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Collections Section */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                ) : collections.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">No collections found.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {collections
                            .filter((collection) => !collectionParam || collection.name === collectionParam)
                            .map((collection) => {
                            const collectionProducts = getProductsByCollection(collection);
                            const isExpanded = expandedCollections.includes(collection.id);

                            return (
                                <div key={collection.id} className="border-b pb-8 last:border-b-0">
                                    {/* Collection Header */}
                                    <button
                                        onClick={() => toggleCollection(collection.id)}
                                        className="w-full flex items-center justify-between mb-6 hover:opacity-70 transition-opacity"
                                    >
                                        <div className="text-left">
                                            <h2 className="text-2xl font-serif font-bold text-black">
                                                {collection.name}
                                            </h2>
                                            {collection.description && (
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {collection.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">
                                                {collectionProducts.length} product
                                                {collectionProducts.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <ChevronDown
                                            size={24}
                                            className={`text-black transition-transform ${
                                                isExpanded ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>

                                    {/* Collection Products */}
                                    {isExpanded && (
                                        <>
                                            {collectionProducts.length === 0 ? (
                                                <p className="text-gray-600 text-center py-8">
                                                    No products in this collection match your filters.
                                                </p>
                                            ) : (
                                                <div
                                                    className={`grid gap-8 ${
                                                        layout === 'grid'
                                                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                                                            : 'grid-cols-1'
                                                    }`}
                                                >
                                                    {collectionProducts.map((product) => (
                                                        <Link
                                                            href={`/product/${product.id}`}
                                                            key={product.id}
                                                            className={`group relative cursor-pointer ${
                                                                layout === 'list'
                                                                    ? 'flex gap-6 items-start p-6 border hover:bg-gray-50 transition-colors'
                                                                    : 'hover:opacity-80 transition-opacity'
                                                            }`}
                                                        >
                                                            {/* Product Image */}
                                                            <div
                                                                className={`relative overflow-hidden bg-gray-100 ${
                                                                    layout === 'list'
                                                                        ? 'w-32 h-40 flex-shrink-0'
                                                                        : 'w-full aspect-square'
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`w-full h-full ${
                                                                        product.imageUrl ||
                                                                        getPlaceholderImage(product.name)
                                                                    } flex items-center justify-center`}
                                                                >
                                                                    {product.onSale && (
                                                                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                                                                            SALE
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Product Info */}
                                                            <div
                                                                className={`${
                                                                    layout === 'list' ? '' : 'mt-4'
                                                                }`}
                                                            >
                                                                <h3 className="text-sm font-medium leading-tight uppercase text-black text-left">
                                                                    {product.name}
                                                                </h3>

                                                                {layout === 'list' && (
                                                                    <>
                                                                        <p className="text-xs text-gray-600 mt-2">
                                                                            {product.color}
                                                                        </p>
                                                                        <p className="text-xs text-gray-600">
                                                                            Sizes:{' '}
                                                                            {product.size.join(', ')}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            <span className="text-sm font-medium text-black">
                                                                                {product.rating}
                                                                                ★
                                                                            </span>
                                                                            <span className="text-xs text-gray-600">
                                                                                ({product.reviews} reviews)
                                                                            </span>
                                                                        </div>
                                                                        <span
                                                                            className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                                                                                product.inStock
                                                                                    ? 'bg-green-100 text-green-700'
                                                                                    : 'bg-red-100 text-red-700'
                                                                            }`}
                                                                        >
                                                                            {product.inStock
                                                                                ? 'In Stock'
                                                                                : 'Out of Stock'}
                                                                        </span>
                                                                    </>
                                                                )}

                                                                <div className="mt-2 flex items-center gap-2">
                                                                    {product.onSale && product.salePrice ? (
                                                                        <>
                                                                            <p className="text-sm font-medium text-black">
                                                                                ₹{product.salePrice}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 line-through">
                                                                                ₹{product.price}
                                                                            </p>
                                                                        </>
                                                                    ) : (
                                                                        <p className="text-sm font-medium text-black">
                                                                            ₹{product.price}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Filter Drawer */}
            <FilterDrawer 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={applyFilters}
            />
        </main>
    );
}
