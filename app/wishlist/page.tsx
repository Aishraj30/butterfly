'use client';
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                            <p className="text-sm text-gray-600 mt-1">Save your favorite items for later</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-2">
                        <Card className="sticky top-8">
                            <CardContent className="p-4">
                                {/* Profile Summary */}
                                <div className="text-center mb-6">
                                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                                        <Image
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`}
                                            alt={user.name}
                                            width={80}
                                            height={80}
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>

                                <Separator className="mb-6" />

                                {/* Navigation Menu */}
                                <nav className="space-y-1">
                                    <Link
                                        href="/orders"
                                        className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Package className="h-4 w-4" />
                                            <span className="text-sm font-medium">Orders</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                    
                                    <Link
                                        href="/wishlist"
                                        className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-100 text-gray-900"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Heart className="h-4 w-4" />
                                            <span className="text-sm font-medium">Wishlist</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                    
                                    <Link
                                        href="/addresses"
                                        className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm font-medium">Addresses</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                    
                                    <Separator className="my-4" />
                                    
                                    <Link
                                        href="/profile"
                                        className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <User className="h-4 w-4" />
                                            <span className="text-sm font-medium">Profile</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                    
                                    <Link
                                        href="/settings"
                                        className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut className="h-4 w-4" />
                                            <span className="text-sm font-medium">Settings</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                </nav>

                                <Separator className="my-6" />

                                {/* Logout Button */}
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-10">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900">Wishlist Items</CardTitle>
                                <CardDescription className="mt-1">Manage your favorite products</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : wishlistItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                                        <p className="text-gray-600 mb-6">Start adding items to your wishlist to see them here.</p>
                                        <Button asChild>
                                            <Link href="/" className="flex items-center gap-2">
                                                <ShoppingBag className="h-4 w-4" />
                                                Start Shopping
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {wishlistItems.map((item) => (
                                            <div key={item._id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="relative aspect-[3/4] bg-gray-100">
                                                    {item.product.images?.[0] && (
                                                        <Image
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    )}
                                                    <button
                                                        onClick={() => removeFromWishlistHandler(item._id)}
                                                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.product.name}</h3>
                                                    <p className="text-lg font-bold text-black">IDR {item.product.price.toLocaleString()}</p>
                                                    <Button asChild className="w-full mt-4">
                                                        <Link href={`/product/${item.product._id}`} className="flex items-center justify-center gap-2">
                                                            <ShoppingBag className="h-4 w-4" />
                                                            View Product
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Mobile Navigation */}
                        <div className="mt-8 sm:hidden">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" asChild className="h-12">
                                            <Link href="/profile" className="flex items-center justify-center gap-2">
                                                <User className="h-4 w-4" />
                                                Profile
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild className="h-12">
                                            <Link href="/orders" className="flex items-center justify-center gap-2">
                                                <Package className="h-4 w-4" />
                                                Orders
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild className="h-12">
                                            <Link href="/addresses" className="flex items-center justify-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Addresses
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild className="h-12">
                                            <Link href="/settings" className="flex items-center justify-center gap-2">
                                                <LogOut className="h-4 w-4" />
                                                Settings
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
