'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ArrowRight, Star, Layers } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// --- Types ---
interface FeaturedDrawerProps {
    isOpen: boolean
    onClose: () => void
}

interface Collection {
    _id: string
    name: string
    slug: string
    description?: string
    products: any[]
    bannerImage?: string
    isFeatured: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// --- Components ---

const CollectionSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/3] border border-white/10 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                </div>
                <div className="h-3 bg-white/10 rounded w-1/4"></div>
            </div>
        ))}
    </div>
)

export function FeaturedDrawer({ isOpen, onClose }: FeaturedDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth()
    
    // State
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch featured collections
    useEffect(() => {
        if (collections.length === 0) {
            setLoading(true)
            fetch('/api/collections')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.collections) {
                        const featuredCollections = data.collections.filter((collection: Collection) => 
                            collection.isFeatured && collection.isActive
                        )
                        setCollections(featuredCollections)
                    }
                })
                .catch(error => console.error('Failed to fetch featured collections:', error))
                .finally(() => setLoading(false))
        }
    }, [])

    // Body Scroll Lock
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

    // --- Animation Helper ---
    const getAnimationClass = (delayIndex: number) => {
        const baseClass = "transform transition-all duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]"
        const activeClass = isOpen && !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        return `${baseClass} ${activeClass}`
    }
    
    const getDelayStyle = (index: number) => ({ transitionDelay: `${150 + (index * 50)}ms` })

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Top Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 z-[101] w-full 
                    bg-black/20 backdrop-blur-2xl 
                    border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]
                    font-sans text-white
                    transition-transform duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                    ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
                style={{ maxHeight: '85vh' }}
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply opacity-50" />

                <div className="relative flex flex-col px-6 md:px-12 py-8 max-h-[85vh] overflow-y-auto scrollbar-hide">

                    {/* 1. Header Row */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl tracking-[0.3em] uppercase text-white font-medium drop-shadow-md">
                                Collections
                            </h2>
                            <span className="hidden md:inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-[10px] text-white/80">
                                {collections.length}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="group p-2 text-white/60 hover:text-white transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90 drop-shadow-sm" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* 2. Main Grid Content */}
                    <div className="flex-1 pb-12">
                        {loading ? (
                            <CollectionSkeleton />
                        ) : collections.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {collections.map((collection, index) => (
                                    <Link 
                                        key={collection._id}
                                        href={`/collections/${collection.slug}`}
                                        onClick={onClose}
                                        style={getDelayStyle(index)}
                                        className={`group relative flex flex-col justify-between 
                                            aspect-[4/3] md:aspect-square 
                                            border border-white/10 bg-white/[0.02] 
                                            p-6 hover:bg-white/[0.06] hover:border-white/20 
                                            transition-all duration-500 ${getAnimationClass(index)}`}
                                    >
                                        {/* Top Section: Title & Arrow */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-medium uppercase tracking-[0.2em] text-white group-hover:text-white/90 transition-colors max-w-[80%]">
                                                    {collection.name}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-white/40 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                                            </div>
                                            
                                            {collection.description && (
                                                <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2 font-light tracking-wide">
                                                    {collection.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Bottom Section: Meta Data */}
                                        <div className="pt-6 mt-auto flex items-end justify-between border-t border-white/5">
                                            <div className="flex items-center gap-2 text-white/40 group-hover:text-white/70 transition-colors">
                                                <Layers className="w-3 h-3" />
                                                <span className="text-[10px] uppercase tracking-[0.15em]">
                                                    {collection.products?.length || 0} Items
                                                </span>
                                            </div>
                                            
                                            {collection.isFeatured && (
                                                <div className="flex items-center gap-1.5 text-amber-200/80">
                                                    <Star className="w-3 h-3 fill-current" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className={`flex flex-col items-center justify-center py-20 border border-white/10 border-dashed ${getAnimationClass(0)}`}>
                                <Layers className="w-8 h-8 text-white/20 mb-4" />
                                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                                    No featured collections
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 3. Footer */}
                    <div 
                        className={`pt-6 border-t border-white/10 flex justify-between items-center ${getAnimationClass(10)}`}
                        style={getDelayStyle(5)}
                    >
                        <div className="flex gap-6">
                            {!user && (
                                <Link
                                    href="/account"
                                    onClick={onClose}
                                    className="text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors"
                                >
                                    Log In / Sign Up
                                </Link>
                            )}
                        </div>
                         <div className="flex gap-2 opacity-50">
                             <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                             <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}