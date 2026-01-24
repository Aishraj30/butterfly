'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FilterDrawer } from '@/components/layout/FilterDrawer';
import { CatalogBanner } from '@/components/catalog/CatalogBanner';
import { ProductImageCarousel } from '@/components/catalog/ProductImageCarousel';

const products = [
    { 
        id: 1, 
        name: 'RASTAH PEACOCK BOMBER JACKET', 
        price: '$4,700',
        images: [
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'
        ],
        category: 'male'
    },
    { 
        id: 2, 
        name: 'AK COLLAR TRENCH COAT', 
        price: '$3,200',
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
        ],
        category: 'male'
    },
    { 
        id: 3, 
        name: 'OVERSIZED BLUE NOTCH COLLAR OVERCOAT', 
        price: '$5,100',
        images: [
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
            'https://images.unsplash.com/photo-1529139574466-a302c2d56dc6?w=800&q=80',
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80'
        ],
        category: 'male'
    },
    { 
        id: 4, 
        name: 'RASTAH 1995 LEATHER JACKET', 
        price: '$6,800',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
        ],
        category: 'male'
    },
    { 
        id: 5, 
        name: 'PREMIUM COTTON BLAZER', 
        price: '$2,900',
        images: [
            'https://images.unsplash.com/photo-1529139574466-a302c2d56dc6?w=800&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'
        ],
        category: 'male'
    },
    { 
        id: 6, 
        name: 'CLASSIC DENIM JACKET', 
        price: '$1,800',
        images: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
        ],
        category: 'male'
    },
    { 
        id: 7, 
        name: 'WOOL OVERCOAT', 
        price: '$4,200',
        images: [
            'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
            'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=800&q=80',
            'https://images.unsplash.com/photo-1529139574466-a302c2d56dc6?w=800&q=80'
        ],
        category: 'male'
    },
    { 
        id: 8, 
        name: 'SPORTY WINDBREAKER', 
        price: '$950',
        images: [
            'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=800&q=80',
            'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80'
        ],
        category: 'male'
    },
];

export default function CatalogPage() {
    const [selectedGender, setSelectedGender] = useState('male');
    const [selectedSize, setSelectedSize] = useState('xs');
    const [layout, setLayout] = useState('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <main className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
            {/* Banner Section */}
            <CatalogBanner />
            
            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-10 pb-6">
                    <div className="flex items-center gap-5">
                        <span className="text-base font-medium text-black">102 Items</span>
                        <button 
                            onClick={() => setIsFilterOpen(true)}
                            className="text-sm font-medium underline flex items-center gap-2 text-black cursor-pointer hover:opacity-70"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
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
                                        selectedSize === size.toLowerCase()
                                            ? 'bg-[#8D7B68] text-white border-[#8D7B68]'
                                            : 'bg-transparent text-black border-[#8D7B68] hover:bg-[#8D7B68] hover:text-white'
                                    }`}
                                    onClick={() => setSelectedSize(size.toLowerCase())}
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

                {/* Product Grid */}
                <div className={`grid gap-8 ${
                    layout === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
                        : 'grid-cols-1'
                }`}>
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className={`group relative ${
                                layout === 'list' ? 'flex gap-6 items-center p-6 border' : ''
                            }`}
                        >
                            <ProductImageCarousel 
                                images={product.images}
                                alt={product.name}
                            />
                            <h3 className={`text-sm font-medium leading-tight uppercase text-black text-left ${
                                layout === 'list' ? '' : 'mt-4'
                            }`}>
                                {product.name}
                            </h3>
                            <p className={`text-sm font-medium text-black text-left ${
                                layout === 'list' ? '' : ''
                            }`}>
                                {product.price}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Filter Drawer */}
            <FilterDrawer 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)} 
            />
        </main>
    )
}
