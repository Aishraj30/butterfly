'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, X } from 'lucide-react';

const wishlistItems = [
    { id: 1, name: 'Brown Leather Jacket', price: 'IDR 300.000', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80' },
    { id: 2, name: 'Black Yellow Square Shirt', price: 'IDR 300.000', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80' },
    { id: 4, name: 'Unisex Orange Sweater', price: 'IDR 300.000', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80' },
];

export default function WishlistPage() {
    return (
        <main className="pt-40 pb-20 max-w-[1400px] mx-auto px-6">
            <h1 className="font-serif text-5xl text-[#4A4A4A] mb-12">WISHLIST</h1>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlistItems.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                <button className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={16} />
                                </button>

                                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="w-full bg-[#8B5E34] text-white py-3 font-bold text-sm tracking-widest hover:bg-[#7A5229] transition-colors flex items-center justify-center gap-2">
                                        <ShoppingBag size={16} /> ADD TO CART
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-serif text-lg text-gray-900 leading-tight">
                                    {product.name}
                                </h3>
                                <p className="text-sm font-medium text-gray-600">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
                    <Link href="/catalog" className="inline-block bg-[#8B5E34] text-white px-8 py-3 font-bold tracking-widest hover:bg-[#7A5229] transition-colors">
                        BROWSE PRODUCTS
                    </Link>
                </div>
            )}
        </main>
    )
}
