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
import { BackToHomeButton } from "@/components/ui/BackToHomeButton";
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useRef } from 'react';


export default function WishlistPage() {
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Body Scroll Lock - ultra robust version to completely prevent background scrolling
    useEffect(() => {
        const htmlElement = document.documentElement
        const bodyElement = document.body

        // Store original styles
        const originalHtmlOverflow = htmlElement.style.overflow
        const originalBodyOverflow = bodyElement.style.overflow
        const originalBodyPosition = bodyElement.style.position
        const originalBodyTop = bodyElement.style.top
        const originalBodyLeft = bodyElement.style.left
        const originalBodyWidth = bodyElement.style.width
        const originalBodyHeight = bodyElement.style.height
        const originalBodyMarginRight = bodyElement.style.marginRight

        // Calculate scrollbar width to prevent layout shift
        const getScrollbarWidth = () => {
            const temp = document.createElement('div')
            temp.style.cssText = 'position: absolute; top: -9999px; width: 100px; height: 100px; overflow: scroll; visibility: hidden;'
            document.body.appendChild(temp)
            const scrollbarWidth = temp.offsetWidth - temp.clientWidth
            document.body.removeChild(temp)
            return scrollbarWidth
        }

        if (isAccountDrawerOpen) {
            const scrollY = window.scrollY
            const scrollX = window.scrollX
            const scrollbarWidth = getScrollbarWidth()

            htmlElement.style.overflow = 'hidden'
            bodyElement.style.position = 'fixed'
            bodyElement.style.top = `-${scrollY}px`
            bodyElement.style.left = `-${scrollX}px`
            bodyElement.style.width = `calc(100vw - ${scrollbarWidth}px)`
            bodyElement.style.height = '100vh'
            bodyElement.style.overflow = 'hidden'
            bodyElement.style.touchAction = 'none'
            bodyElement.style.webkitUserSelect = 'none'
            bodyElement.style.userSelect = 'none'
            bodyElement.style.marginRight = `${scrollbarWidth}px`

                ; (bodyElement as any).storedScrollY = scrollY
                ; (bodyElement as any).storedScrollX = scrollX
                ; (bodyElement as any).scrollbarWidth = scrollbarWidth
                ; (bodyElement as any).originalStyles = {
                    htmlOverflow: originalHtmlOverflow,
                    bodyOverflow: originalBodyOverflow,
                    bodyPosition: originalBodyPosition,
                    bodyTop: originalBodyTop,
                    bodyLeft: originalBodyLeft,
                    bodyWidth: originalBodyWidth,
                    bodyHeight: originalBodyHeight,
                    bodyMarginRight: originalBodyMarginRight
                }
        } else {
            const storedScrollY = (bodyElement as any).storedScrollY || 0
            const storedScrollX = (bodyElement as any).storedScrollX || 0
            const storedStyles = (bodyElement as any).originalStyles || {}

            htmlElement.style.overflow = storedStyles.htmlOverflow || ''
            bodyElement.style.position = storedStyles.bodyPosition || ''
            bodyElement.style.top = storedStyles.bodyTop || ''
            bodyElement.style.left = storedStyles.bodyLeft || ''
            bodyElement.style.width = storedStyles.bodyWidth || ''
            bodyElement.style.height = storedStyles.bodyHeight || ''
            bodyElement.style.overflow = storedStyles.bodyOverflow || ''
            bodyElement.style.touchAction = ''
            bodyElement.style.webkitUserSelect = ''
            bodyElement.style.userSelect = ''
            bodyElement.style.marginRight = storedStyles.bodyMarginRight || ''

            window.scrollTo(storedScrollX, storedScrollY)

            delete (bodyElement as any).storedScrollY
            delete (bodyElement as any).storedScrollX
            delete (bodyElement as any).scrollbarWidth
            delete (bodyElement as any).originalStyles
        }

        return () => {
            const storedStyles = (bodyElement as any).originalStyles || {}
            htmlElement.style.overflow = storedStyles.htmlOverflow || ''
            bodyElement.style.position = storedStyles.bodyPosition || ''
            bodyElement.style.top = storedStyles.bodyTop || ''
            bodyElement.style.left = storedStyles.bodyLeft || ''
            bodyElement.style.width = storedStyles.bodyWidth || ''
            bodyElement.style.height = storedStyles.bodyHeight || ''
            bodyElement.style.overflow = storedStyles.bodyOverflow || ''
            bodyElement.style.touchAction = ''
            bodyElement.style.webkitUserSelect = ''
            bodyElement.style.userSelect = ''
            bodyElement.style.marginRight = storedStyles.bodyMarginRight || ''
            delete (bodyElement as any).storedScrollY
            delete (bodyElement as any).storedScrollX
            delete (bodyElement as any).scrollbarWidth
            delete (bodyElement as any).originalStyles
        }
    }, [isAccountDrawerOpen])

    // Prevent any background scrolling with comprehensive event blocking
    useEffect(() => {
        const preventAllScroll = (e: Event) => {
            if (isAccountDrawerOpen) {
                const drawerElement = drawerRef.current
                if (!drawerElement || !drawerElement.contains(e.target as Node)) {
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    return false
                }
                if (drawerElement && drawerElement.contains(e.target as Node)) {
                    e.stopPropagation()
                }
            }
        }

        const preventWheel = (e: Event) => {
            if (isAccountDrawerOpen) {
                const drawerElement = drawerRef.current
                if (!drawerElement || !drawerElement.contains(e.target as Node)) {
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    return false
                }
                e.stopPropagation()
            }
        }

        const preventTouch = (e: TouchEvent) => {
            if (isAccountDrawerOpen) {
                const drawerElement = drawerRef.current
                if (!drawerElement || !drawerElement.contains(e.target as Node)) {
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    return false
                }
            }
        }

        const preventKeyScroll = (e: KeyboardEvent) => {
            if (isAccountDrawerOpen && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
                const drawerElement = drawerRef.current
                if (!drawerElement || !drawerElement.contains(e.target as Node)) {
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    return false
                }
            }
        }

        if (isAccountDrawerOpen) {
            document.addEventListener('wheel', preventWheel as EventListener, { passive: false, capture: true })
            document.addEventListener('mousewheel', preventWheel as EventListener, { passive: false, capture: true })
            document.addEventListener('DOMMouseScroll', preventWheel as EventListener, { passive: false, capture: true })
            document.addEventListener('touchmove', preventTouch, { passive: false, capture: true })
            document.addEventListener('touchstart', preventAllScroll, { passive: false, capture: true })
            document.addEventListener('touchend', preventAllScroll, { passive: false, capture: true })
            document.addEventListener('keydown', preventKeyScroll, { capture: true })
            document.addEventListener('scroll', preventAllScroll, { capture: true })
            window.addEventListener('wheel', preventWheel as EventListener, { passive: false, capture: true })
            window.addEventListener('scroll', preventAllScroll, { capture: true })
        }

        return () => {
            document.removeEventListener('wheel', preventWheel as EventListener, { capture: true })
            document.removeEventListener('mousewheel', preventWheel as EventListener, { capture: true })
            document.removeEventListener('DOMMouseScroll', preventWheel as EventListener, { capture: true })
            document.removeEventListener('touchmove', preventTouch, { capture: true })
            document.removeEventListener('touchstart', preventAllScroll, { capture: true })
            document.removeEventListener('touchend', preventAllScroll, { capture: true })
            document.removeEventListener('keydown', preventKeyScroll, { capture: true })
            document.removeEventListener('scroll', preventAllScroll, { capture: true })
            window.removeEventListener('wheel', preventWheel as EventListener, { capture: true })
            window.removeEventListener('scroll', preventAllScroll, { capture: true })
        }
    }, [isAccountDrawerOpen])

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
            {/* Page Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 md:relative z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsAccountDrawerOpen(true)}
                                className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <Menu className="h-6 w-6 text-black" />
                            </button>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-birds text-black lowercase leading-none">
                                    My Wishlist
                                </h1>
                                <p className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-4 font-bold">
                                    Your curated collection of luxury pieces
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <BackToHomeButton variant="elegant" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full">
                    {/* Main Content Area */}
                    <div className="w-full">
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
                                    <div className="space-y-6">
                                        {wishlistItems.map((item) => (
                                            <div key={item._id} className="group relative flex gap-6 pb-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 p-2 transition-colors rounded-xl">
                                                {/* Product Image */}
                                                <div className="relative w-24 h-32 md:w-32 md:h-44 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                    {item.product.images?.[0] ? (
                                                        <Image
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100" />
                                                    )}
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                    <div className="relative pr-8">
                                                        <div className="mb-1">
                                                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                                                                {item.product.category || 'Luxury Collection'}
                                                            </span>
                                                        </div>
                                                        <Link href={`/product/${item.product._id}`}>
                                                            <h3 className="font-bold text-sm md:text-base text-black uppercase tracking-widest hover:text-gray-600 transition-colors truncate">
                                                                {item.product.name}
                                                            </h3>
                                                        </Link>
                                                        <p className="mt-2 text-base md:text-lg font-bold text-black tracking-tight">
                                                            ₹{item.product.price.toLocaleString()}
                                                        </p>

                                                        <button
                                                            onClick={() => removeFromWishlistHandler(item._id)}
                                                            className="absolute top-0 right-0 p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                            title="Remove from wishlist"
                                                        >
                                                            <X className="h-5 w-5" strokeWidth={1.5} />
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 mt-4">
                                                        <Button asChild variant="outline" className="h-10 px-6 text-[10px] uppercase tracking-[0.2em] font-bold border-black hover:bg-black hover:text-white transition-all rounded-none">
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
                    </div>
                </div>
            </div>

            {/* Account Management Drawer */}
            <AnimatePresence>
                {isAccountDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAccountDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            ref={drawerRef}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-full max-w-sm bg-white z-[101] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                                <h2 className="text-xl font-bold text-black uppercase tracking-widest">Account</h2>
                                <button
                                    onClick={() => setIsAccountDrawerOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Profile Summary in Drawer */}
                                <div className="text-center mb-10 mt-4">
                                    <div className="relative h-24 w-24 mx-auto mb-4 group">
                                        <div className="absolute inset-0 bg-black rounded-full scale-105 opacity-5 group-hover:opacity-10 transition-opacity" />
                                        <Image
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`}
                                            alt={user.name}
                                            width={96}
                                            height={96}
                                            className="rounded-full object-cover border-4 border-white shadow-sm"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-black uppercase tracking-widest">{user.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                                </div>

                                <nav className="space-y-4">
                                    {[
                                        { href: '/profile', icon: User, label: 'Profile' },
                                        { href: '/orders', icon: Package, label: 'Orders' },
                                        { href: '/wishlist', icon: Heart, label: 'Wishlist', active: true },
                                        { href: '/addresses', icon: MapPin, label: 'Addresses' },
                                    ].map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${link.active
                                                ? 'bg-black text-white shadow-lg'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                                }`}
                                        >
                                            <link.icon className="h-5 w-5" strokeWidth={link.active ? 2.5 : 2} />
                                            <span className="text-xs font-bold uppercase tracking-[0.2em]">{link.label}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6 border-t border-gray-100 space-y-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-colors"
                                >
                                    <LogOut size={16} strokeWidth={2.5} />
                                    Sign Out
                                </button>
                                <p className="text-[10px] text-center text-gray-300 uppercase tracking-widest font-medium">
                                    Butterfly Couture • v1.0.0
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
