'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, X } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';

export default function WishlistPage() {
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const { user } = useAuth();

    const removeFromWishlistHandler = async (wishlistItemId: string) => {
        try {
            await removeFromWishlist(wishlistItemId);
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            alert('Failed to remove item from wishlist');
        }
    };

    if (!user) {
        return (
            <main className="min-h-screen bg-white pt-10 pb-20 w-full">
                <div className="max-w-[1400px] mx-auto px-5 py-20 text-center">
                    <h2 className="text-2xl font-bold text-black mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
                    <Link href="/login" className="inline-block bg-black text-white px-8 py-3 font-bold tracking-widest hover:bg-gray-800 transition-colors">
                        LOGIN
                    </Link>
                </div>
            </main>
        );
    }
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
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((wishlistItem) => (
                            <div key={wishlistItem._id} className="group">
                                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                                    <Image
                                        src={wishlistItem.product.images?.[0] || wishlistItem.product.image || '/uploads/product-1769084011566.jpeg'}
                                        alt={wishlistItem.product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Remove button */}
                                    <button 
                                        onClick={() => removeFromWishlistHandler(wishlistItem._id)}
                                        className="absolute top-4 right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <h3 className="font-normal text-base text-black uppercase">
                                            {wishlistItem.product.name}
                                        </h3>
                                        <p className="text-lg font-normal text-black mt-1">
                                            ₹{wishlistItem.product.salePrice || wishlistItem.product.price}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {wishlistItem.product.category}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            // Add to cart functionality
                                            console.log('Added to cart:', wishlistItem.product.name)
                                            // Here you would typically add to cart state management
                                        }}
                                        className="w-full bg-gray-200 text-black py-2 text-sm font-medium tracking-wide hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={14} /> ADD TO CART
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
            </div>
        </main>
    )
}
