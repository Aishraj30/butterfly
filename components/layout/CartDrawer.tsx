'use client'

import { X, ShoppingBag } from 'lucide-react'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

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

    useGSAP(() => {
        if (isOpen) {
            // Open animation
            gsap.to(backdropRef.current, {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.5,
                ease: 'power3.out'
            })
            gsap.to(drawerRef.current, {
                x: 0,
                duration: 0.6,
                ease: 'expo.out'
            })
            // Staggered entry for content
            gsap.fromTo(contentRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' }
            )
        } else {
            // Close animation
            gsap.to(backdropRef.current, {
                opacity: 0,
                pointerEvents: 'none',
                duration: 0.4,
                ease: 'power2.inOut'
            })
            gsap.to(drawerRef.current, {
                x: '100%',
                duration: 0.5,
                ease: 'power3.inOut'
            })
        }
    }, [isOpen])

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                ref={backdropRef}
                onClick={onClose}
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm opacity-0 pointer-events-none cursor-pointer"
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 z-[101] h-screen w-full max-w-[480px] bg-white shadow-2xl translate-x-full"
            >
                <div className="flex h-full flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-8 py-6">
                        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-black">
                            Your Cart
                        </h2>
                        <button
                            onClick={onClose}
                            className="group rounded-full p-2 transition-colors hover:bg-gray-100 cursor-pointer"
                        >
                            <X size={24} className="transition-transform duration-300 group-hover:rotate-90" />
                        </button>
                    </div>

                    {/* Body */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto p-8">
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
                                className="group relative overflow-hidden border border-black px-12 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:text-white cursor-pointer"
                            >
                                <span className="relative z-10">Continue Shopping</span>
                                <div className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 group-hover:translate-y-0" />
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t p-8 bg-gray-50/50">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Subtotal</span>
                            <span className="text-lg font-bold">IDR 0</span>
                        </div>
                        <button
                            disabled
                            className="w-full bg-black/10 py-5 text-sm font-bold uppercase tracking-widest text-black/40 cursor-not-allowed"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
