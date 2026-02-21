'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ShoppingBag, X, Heart, Package, MapPin, User, LogOut,
    Loader2, Settings, Menu, ChevronLeft
} from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from "next/font/google";

import { BackToHomeButton } from "@/components/ui/BackToHomeButton";

const inter = Inter({ subsets: ["latin"] });

export default function WishlistPage() {
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Body Scroll Lock
    useEffect(() => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (isAccountDrawerOpen) {
            const scrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            htmlElement.style.overflow = 'hidden';
            bodyElement.style.position = 'fixed';
            bodyElement.style.top = `-${scrollY}px`;
            bodyElement.style.width = `calc(100vw - ${scrollbarWidth}px)`;
            bodyElement.style.overflow = 'hidden';
            bodyElement.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            const scrollY = bodyElement.style.top;
            htmlElement.style.overflow = '';
            bodyElement.style.position = '';
            bodyElement.style.top = '';
            bodyElement.style.width = '';
            bodyElement.style.overflow = '';
            bodyElement.style.paddingRight = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [isAccountDrawerOpen]);

    const removeFromWishlistHandler = async (wishlistItemId: string) => {
        try {
            await removeFromWishlist(wishlistItemId);
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <main className={`min-h-screen bg-white pt-32 pb-20 w-full flex items-center justify-center ${inter.className}`}>
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
        <div className={`min-h-screen bg-white flex ${inter.className}`}>

            {/* --- Desktop Sidebar (Left Navigation) --- */}
            <aside className="hidden lg:flex flex-col w-64 pt-12 pb-8 px-0 border-r border-gray-200 lg:sticky lg:top-0 h-screen">
                <div className="px-8 mb-8 flex items-center gap-4">
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="group relative inline-flex items-center justify-center w-8 h-8 rounded-full border border-black bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4 text-black transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Profile</h1>
                </div>

                <nav className="flex-1 space-y-1">
                    {/* User Info Section */}
                    <div className="mb-6">
                        <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
                            Account
                        </div>
                        <Link href="/profile" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                            <User className="w-5 h-5" />
                            <span className="font-medium text-sm">User Info</span>
                        </Link>
                    </div>

                    {/* Orders Section */}
                    <div className="mb-6">
                        <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
                            Shopping
                        </div>
                        <Link href="/orders" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                            <Package className="w-5 h-5" />
                            <span className="font-medium text-sm">Orders</span>
                        </Link>

                        {/* Active Link: Wishlist */}
                        <div className="flex items-center gap-4 px-8 py-3 text-black relative bg-gray-100">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-black rounded-r-md" />
                            <Heart className="w-5 h-5" />
                            <span className="font-medium text-sm">Wishlist</span>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div>
                        <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
                            Settings
                        </div>
                        <Link href="/addresses" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium text-sm">Addresses</span>
                        </Link>

                        <Link href="/settings" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                            <Settings className="w-5 h-5" />
                            <span className="font-medium text-sm">Settings</span>
                        </Link>
                    </div>
                </nav>

                <div className="px-8 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 text-gray-500 hover:text-gray-700 transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Log out</span>
                    </button>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main className="flex-1 p-6 lg:px-10 lg:py-8 overflow-y-auto">

                {/* Mobile Header with Drawer Trigger */}
                <div className="lg:hidden flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsAccountDrawerOpen(true)}>
                            <Menu className="h-6 w-6 text-gray-900" />
                        </Button>
                        <span className="font-bold text-lg">My Wishlist</span>
                    </div>
                    <Link href="/cart">
                        <ShoppingBag className="h-5 w-5 text-gray-900" />
                    </Link>
                </div>

                <div className="max-w-6xl">
                    {/* Main Content Area */}
                    <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-bold text-gray-900">Wishlist Items</CardTitle>
                            <CardDescription className="mt-2 text-gray-500">Manage your favorite products</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : wishlistItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Your wishlist is empty</h3>
                                    <p className="text-gray-500 mb-8 font-medium">Start adding items you love to see them here.</p>
                                    <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95">
                                        <Link href="/" className="flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4" />
                                            Start Shopping
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {wishlistItems.filter(item => item.product).map((item) => (
                                        <div key={item._id} className="group relative flex gap-4 md:gap-6 p-4 md:p-6 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">

                                            {/* Product Image */}
                                            <div className="relative w-24 h-32 md:w-36 md:h-48 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                                {item.product.images?.[0] ? (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                <div className="relative pr-8 md:pr-10">
                                                    <div className="mb-1 md:mb-2">
                                                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                                                            {item.product.category || 'Collection'}
                                                        </span>
                                                    </div>
                                                    <Link href={`/product/${item.product._id}`}>
                                                        <h3 className="font-bold text-sm md:text-lg text-gray-900 uppercase tracking-widest hover:text-gray-700 transition-colors line-clamp-2">
                                                            {item.product.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="mt-2 text-base md:text-xl font-bold text-gray-900 tracking-tight">
                                                        ₹{item.product.price.toLocaleString()}
                                                    </p>

                                                    <button
                                                        onClick={() => removeFromWishlistHandler(item._id)}
                                                        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                                                        title="Remove from wishlist"
                                                    >
                                                        <X className="h-5 w-5" strokeWidth={2} />
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                                    <Button asChild variant="outline" className="h-10 md:h-12 px-6 md:px-8 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold border-gray-200 text-gray-700 hover:text-black hover:bg-white transition-all duration-300 rounded-xl w-full md:w-auto">
                                                        <Link href={`/product/${item.product._id}`}>
                                                            View Product
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions (Desktop Only) */}
                    <div className="hidden md:block mt-8">
                        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Button variant="outline" asChild className="h-14 border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium">
                                        <Link href="/profile" className="flex items-center justify-center gap-2">
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild className="h-14 border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium">
                                        <Link href="/orders" className="flex items-center justify-center gap-2">
                                            <Package className="h-4 w-4" />
                                            Orders
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild className="h-14 border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium">
                                        <Link href="/addresses" className="flex items-center justify-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Addresses
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild className="h-14 border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium">
                                        <Link href="/settings" className="flex items-center justify-center gap-2">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Account Management Drawer (Mobile) */}
            <AnimatePresence>
                {isAccountDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAccountDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            ref={drawerRef}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-2xl z-[101] flex flex-col lg:hidden"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent uppercase tracking-widest">Account</h2>
                                <button
                                    onClick={() => setIsAccountDrawerOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                                >
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Profile Summary in Drawer */}
                                <div className="text-center mb-10 mt-4">
                                    <div className="relative h-24 w-24 mx-auto mb-4 group">
                                        <Image
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`}
                                            alt={user.name}
                                            width={96}
                                            height={96}
                                            className="rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">{user.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">{user.email}</p>
                                </div>

                                <nav className="space-y-2">
                                    {[
                                        { href: '/profile', icon: User, label: 'Profile' },
                                        { href: '/orders', icon: Package, label: 'Orders' },
                                        { href: '/wishlist', icon: Heart, label: 'Wishlist', active: true },
                                        { href: '/addresses', icon: MapPin, label: 'Addresses' },
                                        { href: '/settings', icon: Settings, label: 'Settings' }
                                    ].map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            onClick={() => setIsAccountDrawerOpen(false)}
                                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${link.active
                                                ? 'bg-black text-white shadow-md'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <link.icon className="h-5 w-5" strokeWidth={link.active ? 2.5 : 2} />
                                            <span className="text-xs font-bold uppercase tracking-[0.2em]">{link.label}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6 border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all duration-300"
                                >
                                    <LogOut size={16} strokeWidth={2.5} />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}