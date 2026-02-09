import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, X, Heart, Package, MapPin, User, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function WishlistPage() {
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const { user, logout, isLoading: authLoading } = useAuth();

    const removeFromWishlistHandler = async (wishlistItemId: string) => {
        try {
            await removeFromWishlist(wishlistItemId);
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            // In a real app we'd use a toast here
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-white pt-32 pb-20 w-full flex items-center justify-center">
                <div className="max-w-md mx-auto px-5 text-center">
                    <h2 className="text-2xl font-bold text-black mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-8">You need to be logged in to view your wishlist.</p>
                    <Link href="/login" className="inline-block bg-black text-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors uppercase">
                        Login to Account
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-10 sm:pt-36 sm:pb-12 bg-white">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <div className="flex flex-col gap-2">
                        <div className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">Account</div>
                        <h1 className="font-birds text-4xl font-normal tracking-wide text-black sm:text-6xl capitalize">My Wishlist</h1>
                        <p className="max-w-2xl mx-auto text-sm text-gray-600 sm:text-base mt-2">
                            Save your favorite items for later.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Sidebar / Navigation Card */}
                    <div className="lg:col-span-4">
                        <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6 bg-gray-50 flex items-center gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200">
                                        <Image
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Welcome</div>
                                        <div className="truncate font-semibold text-lg text-black">{user.name}</div>
                                    </div>
                                </div>

                                <div className="p-4 space-y-1">
                                    <Button variant="ghost" className="w-full justify-between h-12 text-gray-600 hover:text-black hover:bg-gray-50" asChild>
                                        <Link href="/orders">
                                            <span className="flex items-center gap-3">
                                                <Package className="h-4 w-4" />
                                                My Orders
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-full justify-between h-12 bg-black text-white hover:bg-gray-800 hover:text-white"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Heart className="h-4 w-4" />
                                            Wishlist
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-white/70" />
                                    </Button>

                                    <Button variant="ghost" className="w-full justify-between h-12 text-gray-600 hover:text-black hover:bg-gray-50" asChild>
                                        <Link href="/addresses">
                                            <span className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4" />
                                                Addresses
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </Link>
                                    </Button>

                                    <Button variant="ghost" className="w-full justify-between h-12 text-gray-600 hover:text-black hover:bg-gray-50 mt-2" asChild>
                                        <Link href="/profile">
                                            <span className="flex items-center gap-3">
                                                <User className="h-4 w-4" />
                                                Profile Settings
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </Link>
                                    </Button>
                                </div>

                                <div className="p-4 border-t border-gray-100">
                                    <Button variant="outline" onClick={handleLogout} className="w-full border-gray-200 hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:col-span-8">
                        <Card className="border border-gray-100 shadow-sm rounded-xl">
                            <CardHeader className="pb-4 border-b border-gray-50">
                                <CardTitle className="text-xl font-semibold text-black">Saved Items</CardTitle>
                                <CardDescription>Items you've liked and saved for later.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {loading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                    </div>
                                ) : wishlistItems.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {wishlistItems.map((wishlistItem) => (
                                            <div key={wishlistItem._id} className="group relative border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                                                    <Image
                                                        src={wishlistItem.product.images?.[0] || wishlistItem.product.image || '/uploads/product-1769084011566.jpeg'}
                                                        alt={wishlistItem.product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />

                                                    {/* Remove button */}
                                                    <button
                                                        onClick={() => removeFromWishlistHandler(wishlistItem._id)}
                                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                                                        title="Remove from wishlist"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="font-medium text-sm text-black uppercase tracking-wide truncate">
                                                        {wishlistItem.product.name}
                                                    </h3>
                                                    <div className="flex justify-between items-center mt-2 mb-4">
                                                        <p className="text-base font-semibold text-black">
                                                            ₹{wishlistItem.product.salePrice || wishlistItem.product.price}
                                                        </p>
                                                        <span className="text-xs text-gray-500 capitalize">
                                                            {wishlistItem.product.category}
                                                        </span>
                                                    </div>

                                                    <Button
                                                        className="w-full bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-widest h-9"
                                                    >
                                                        <ShoppingBag size={12} className="mr-2" /> Add to Cart
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-8 text-center py-16">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                                <Heart className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-black">Your wishlist is empty</h3>
                                                <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                                                    Save items you love here to check them out later.
                                                </p>
                                            </div>
                                            <Button asChild className="bg-black text-white hover:bg-gray-900 mt-2 px-8">
                                                <Link href="/catalog">Browse Collection</Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
