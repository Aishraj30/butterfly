'use client'

import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
// import gsap from 'gsap'
// import { useGSAP } from '@gsap/react'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const { cart, isLoading, removeFromCart, updateQuantity } = useCart()

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
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
            {/* Backdrop Overlay */}
            <div
                ref={backdropRef}
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm cursor-pointer transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 z-[101] h-screen w-full max-w-[480px] bg-white shadow-2xl transition-transform duration-500 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-8 py-6">
                        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-black">
                            Your Cart ({cartItems.length})
                        </h2>
                        <button
                            onClick={onClose}
                            className="group rounded-full p-2 transition-colors hover:bg-gray-100 cursor-pointer bg-gray-100"
                        >
                            <X size={24} className="transition-transform duration-300 group-hover:rotate-90 text-black" />
                        </button>
                    </div>

                    {/* Body */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto p-8">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="animate-pulse text-gray-500">Loading cart...</div>
                            </div>
                        ) : isEmpty ? (
                            <div className="flex h-full flex-col items-center justify-center space-y-8 text-center">
                                <div className="relative">
                                    <ShoppingBag size={60} strokeWidth={1} className="text-gray-200" />
                                    <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-[#CDA45D]" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-serif text-3xl text-black">Your cart is empty</h3>
                                    <p className="text-sm text-gray-500 max-w-[240px] mx-auto">
                                        Looks like you haven't added anything to your cart yet.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="group relative overflow-hidden bg-black px-12 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 cursor-pointer"
                                >
                                    <span className="relative z-10">Continue Shopping</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cartItems.map((item, index) => (
                                    <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="flex gap-4 pb-6 border-b">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name || 'Product'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-black truncate">
                                                {item.name || 'Product'}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Size: {item.size} | Color: {item.color}
                                            </p>
                                            <p className="font-semibold text-black mt-1">
                                                ₹{typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : (item.price || 0).toFixed(2)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center border border-gray-300 rounded">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))}
                                                        className="p-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 py-1 text-sm font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
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
                        <div className="border-t p-8 bg-gray-50/50">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Subtotal</span>
                                    <span className="text-lg font-bold">₹{cart.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Shipping</span>
                                    <span className="text-lg font-bold">₹{cart.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Tax</span>
                                    <span className="text-lg font-bold">₹{cart.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t">
                                    <span className="text-sm font-bold uppercase tracking-widest text-black">Total</span>
                                    <span className="text-xl font-bold text-black">₹{cart.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-gray-800 text-center block"
                            >
                                Checkout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
