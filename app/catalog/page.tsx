'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, ChevronDown, Check } from 'lucide-react';

const products = [
    // Mock data based on reference images
    { id: 1, name: 'Brown Leather Jacket', price: 'IDR 300.000', category: 'Jacket', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80', rating: 4.55 },
    { id: 2, name: 'Black Yellow Square Shirt', price: 'IDR 300.000', category: 'Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', rating: 4.95 },
    { id: 3, name: 'White Men Formal Shirt', price: 'IDR 300.000', category: 'Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', rating: 4.95 }, // Using similar placeholder
    { id: 4, name: 'Unisex Orange Sweater', price: 'IDR 300.000', category: 'Hoodie', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', rating: 4.55 },
    { id: 5, name: 'T-Shirt Cotton 30S', price: 'IDR 300.000', category: 'Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', rating: 4.95 },
    { id: 6, name: 'White Oversize Cotton', price: 'IDR 300.000', category: 'Hoodie', image: 'https://images.unsplash.com/photo-1529139574466-a302c2d56dc6?w=800&q=80', rating: 4.55 },
    { id: 7, name: 'White Men Formal Shirt', price: 'IDR 300.000', category: 'Jacket', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', rating: 4.55 },
    { id: 8, name: 'White Woman Formal Shirt', price: 'IDR 300.000', category: 'Hoodie', image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80', rating: 4.95 },
    { id: 9, name: 'Formal Shirt Men', price: 'IDR 300.000', category: 'Hoodie', image: 'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=800&q=80', rating: 4.55 },
];

export default function CatalogPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    return (
        <main className="pt-32 pb-20 max-w-[1400px] mx-auto px-6">
            {/* Page Title */}
            <h1 className="font-serif text-5xl text-[#4A4A4A] mb-12 uppercase tracking-wide">ALL PRODUCTS</h1>

            <div className="flex gap-12">
                {/* Sidebar */}
                <aside className="w-64 hidden lg:block space-y-8">
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider bg-[#E5D3B3] p-2">Category</h3>
                        <ul className="space-y-2">
                            {['Woman', 'Man', 'Unisex'].map((cat) => (
                                <li key={cat}>
                                    <button className="flex items-center justify-between w-full text-sm hover:text-[#8B5E34]">
                                        {cat} <ChevronDown size={14} />
                                    </button>
                                    {/* Expanded Subcategories simulation */}
                                    {cat === 'Woman' && (
                                        <div className="pl-4 mt-2 space-y-2">
                                            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                                                <input type="checkbox" className="rounded-sm border-gray-300" />
                                                Dress
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                                                <input type="checkbox" className="rounded-sm border-gray-300" />
                                                Shirt
                                            </label>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider border-b pb-2">Price</h3>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider border-b pb-2">Size</h3>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider border-b pb-2">Color</h3>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group">
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 bg-[#8B5E34] text-white text-xs font-bold px-2 py-1 flex items-center gap-1 rounded-sm">
                                        ★ {product.rating}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</p>
                                    <h3 className="font-serif text-lg text-gray-900 leading-tight group-hover:text-[#8B5E34] transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-600">{product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination Simulation */}
                    <div className="flex justify-end gap-2 mt-12">
                        {[1, 2, 3, 4, '...', 10].map((page, i) => (
                            <button key={i} className={`w-8 h-8 flex items-center justify-center border text-sm ${page === 1 ? 'bg-[#8B5E34] text-white border-[#8B5E34]' : 'text-gray-500 border-gray-200 hover:border-[#8B5E34]'}`}>
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
