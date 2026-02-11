'use client'

import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/contexts/AuthContext'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const { cart, isLoading, removeFromCart, updateQuantity } = useCart()
    const { user } = useAuth()

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
        } else {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
        }
    }, [isOpen])

    const handleRemoveItem = async (productId: string, size: string, color: string) => {
        try {
            await removeFromCart(productId, size, color)
        } catch (error) {
            console.error('Failed to remove item:', error)
        }
    }

    const handleUpdateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
        try {
            await updateQuantity(productId, size, color, quantity)
        } catch (error) {
            console.error('Failed to update quantity:', error)
        }
    }

    const cartItems = cart?.items || []
    const isEmpty = cartItems.length === 0

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 z-[101] h-[100dvh] w-full max-w-[380px] 
                    bg-black/40 backdrop-blur-2xl 
                    border-l border-white/20 shadow-[20px_0_50px_rgba(0,0,0,0.1)]
                    font-sans text-white
                    transition-transform duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Noise/Texture Overlay */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply opacity-50" />

                <div className="relative flex h-full flex-col px-8 pt-12 pb-8">

                    {/* Header: Minimal & Centered */}
                    <div className="relative flex items-center justify-between mb-12">
                        <div className="w-6" /> 
                        
                        <h2 className="text-xl tracking-[0.3em] uppercase text-white font-medium">
                            Cart ({cartItems.length})
                        </h2>

                        <button
                            onClick={onClose}
                            className="group text-white/60 hover:text-white transition-colors"
                            aria-label="Close cart"
                        >
                            <X className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="animate-pulse text-white/60 font-sans">Loading cart...</div>
                            </div>
                        ) : isEmpty ? (
                            <div className="flex h-full flex-col items-center justify-center space-y-8 text-center">
                                <div className="relative">
                                    <ShoppingBag size={60} strokeWidth={1} className="text-white/20" />
                                    <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-white/20" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-serif text-2xl text-white">Your cart is empty</h3>
                                    <p className="text-sm text-white/60 max-w-[240px] mx-auto font-sans">
                                        Looks like you haven't added anything to your cart yet.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="group relative overflow-hidden bg-white/20 backdrop-blur-md px-12 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/30 cursor-pointer border border-white/20"
                                >
                                    <span className="relative z-10">Continue Shopping</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {cartItems.map((item, index) => (
                                    <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="flex gap-4 pb-6 border-b border-white/10">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name || 'Product'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/20" />
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-white truncate">
                                                {item.name || 'Product'}
                                            </h4>
                                            <p className="text-sm text-white/60 font-sans">
                                                Size: {item.size} | Color: {item.color}
                                            </p>
                                            <p className="font-semibold text-white mt-1">
                                                ₹{typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : (item.price || 0).toFixed(2)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center border border-white/20 rounded bg-white/10">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))}
                                                        className="p-1 hover:bg-white/20 transition-colors text-white/60"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 py-1 text-sm font-medium text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                                        className="p-1 hover:bg-white/20 transition-colors text-white/60"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                                                    className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!isEmpty && (
                        <div className="pt-8 border-t border-white/20">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60 font-sans">Subtotal</span>
                                    <span className="text-sm font-bold text-white">₹{cart.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60 font-sans">Shipping</span>
                                    <span className="text-sm font-bold text-white">₹{cart.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60 font-sans">Tax</span>
                                    <span className="text-sm font-bold text-white">₹{cart.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                    <span className="text-sm font-bold uppercase tracking-[0.15em] text-white font-sans">Total</span>
                                    <span className="text-lg font-bold text-white">₹{cart.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                className="w-full bg-white/20 backdrop-blur-md text-white py-4 text-sm font-bold uppercase tracking-widest transition-all hover:bg-white/30 text-center block border border-white/20"
                            >
                                Checkout
                            </Link>
                            
                            {!user && (
                                <Link
                                    href="/account"
                                    onClick={onClose}
                                    className="block text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors mt-4 font-sans text-center"
                                >
                                    Log In to Continue
                                </Link>
                            )}
                        </div>
                    )}
                    
                    {/* Empty Footer */}
                    {isEmpty && (
                        <div className="pt-8 border-t border-white/20">
                            {!user && (
                                <Link
                                    href="/account"
                                    onClick={onClose}
                                    className="block text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors mb-4 font-sans"
                                >
                                    Log In
                                </Link>
                            )}
                            <div className="flex gap-4">
                                 <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                 <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
