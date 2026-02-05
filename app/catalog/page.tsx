'use client';

import { useState, useEffect } from 'react';
import { CatalogBanner } from '@/components/catalog/CatalogBanner';
import Link from 'next/link';

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
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            setIsLoading(true);
            const collectionsRes = await fetch('/api/collections');
            const collectionsData = await collectionsRes.json();

            if (collectionsData.success) {
                setCollections(collectionsData.data);
            }
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            // Navigate to search results page
            window.location.href = `/catalog/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
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
            <CatalogBanner />

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {/* Search Bar */}
                <div className="mb-8 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setIsSearchOpen(true)}
                            placeholder="Search products..."
                            className="w-full px-4 py-3 pr-12 border border-[#8D7B68] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#8D7B68] bg-white text-black"
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#8D7B68] hover:bg-[#8D7B68] hover:text-white transition-colors rounded-sm"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-5.197-5.197-2.121-2.121-2.121-2.121 0-3.66 2.121-2.121 2.121 2.121 3.66 0 2.121 2.121 2.121 5.197" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Categories Section */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                ) : collections.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">No categories found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection) => (
                            <Link
                                href={`/catalog/${encodeURIComponent(collection.name)}`}
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
        </main>
    );
}
