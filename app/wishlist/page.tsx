'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, X } from 'lucide-react';

// Mock data - in a real app, this would come from a global state or API
const allProducts = [
    { 
        id: 1, 
        name: 'BROWN LEATHER JACKET', 
        price: '$2,900',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
        category: 'jackets'
    },
    { 
        id: 2, 
        name: 'BLACK YELLOW SHIRT', 
        price: '$1,800',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
        category: 'shirts'
    },
    { 
        id: 3, 
        name: 'UNISEX ORANGE SWEATER', 
        price: '$1,200',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
        category: 'sweaters'
    },
    { 
        id: 4, 
        name: 'PREMIUM COTTON BLAZER', 
        price: '$2,900',
        image: 'https://images.unsplash.com/photo-1529139574466-a302c2d56dc6?w=800&q=80',
        category: 'blazers'
    },
    { 
        id: 5, 
        name: 'CLASSIC DENIM JACKET', 
        price: '$1,800',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        category: 'jackets'
    },
    { 
        id: 6, 
        name: 'WOOL OVERCOAT', 
        price: '$4,200',
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
        category: 'coats'
    },
];

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState(allProducts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading and get wishlist items
        const timer = setTimeout(() => {
            // In a real app, you'd filter products based on wishlist IDs from state/API
            setWishlistItems(allProducts); // For now, show all products
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const removeFromWishlist = (productId: number) => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
    };
    return (
        <main className="min-h-screen bg-white pt-10 pb-20 w-full">
            {/* Banner Section */}
            <div className="w-full py-16 px-5 text-center bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-serif text-[#8D7B68] italic">
                            Discover
                        </h2>
                        <h3 className="text-2xl md:text-3xl font-sans font-bold text-black uppercase tracking-wider">
                            WISHLIST
                        </h3>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="group">
                                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Remove button */}
                                    <button 
                                        onClick={() => removeFromWishlist(product.id)}
                                        className="absolute top-4 right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-lg text-black uppercase">
                                            {product.name}
                                        </h3>
                                        <p className="text-xl font-bold text-black mt-2">
                                            {product.price}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {product.category}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            // Add to cart functionality
                                            console.log('Added to cart:', product.name)
                                            // Here you would typically add to cart state management
                                        }}
                                        className="w-full bg-black text-white py-3 font-bold tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={16} /> ADD TO CART
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
                        <Link href="/catalog" className="inline-block bg-black text-white px-8 py-3 font-bold tracking-widest hover:bg-gray-800 transition-colors">
                            BROWSE PRODUCTS
                        </Link>
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link href="/catalog" className="inline-flex items-center justify-center px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide uppercase">
                        View All Products
                    </Link>
                </div>
            </div>
        </main>
    )
}
