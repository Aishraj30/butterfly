'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ChevronRight, Star } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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

export function FeaturedDrawer({ isOpen, onClose }: FeaturedDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth()
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch featured collections from backend
    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.collections) {
                    // Filter for featured collections only
                    const featuredCollections = data.collections.filter((collection: Collection) => 
                        collection.isFeatured && collection.isActive
                    )
                    setCollections(featuredCollections)
                }
            })
            .catch(error => console.error('Failed to fetch featured collections:', error))
            .finally(() => setLoading(false))
    }, [])

    // Prevent body scroll when featured drawer is open
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

    const toggleExpanded = (id: string) => {
        setExpandedItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

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
                className={`fixed top-0 left-0 z-[101] h-[100dvh] w-full max-w-[320px] 
                    bg-black/40 backdrop-blur-2xl 
                    border-r border-white/20 shadow-[20px_0_50px_rgba(0,0,0,0.1)]
                    font-sans text-white
                    transition-transform duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Noise/Texture Overlay */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply opacity-50" />

                <div className="relative flex h-full flex-col px-8 pt-12 pb-8">

                    {/* Header: Minimal & Centered */}
                    <div className="relative flex items-center justify-between mb-12">
                        {/* Empty div for spacing balance */}
                        <div className="w-6" /> 
                        
                        <h2 className="text-xl tracking-[0.3em] uppercase text-white font-medium">
                            Featured
                        </h2>

                        <button
                            onClick={onClose}
                            className="group text-white/60 hover:text-white transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent space-y-8">
                        
                        {/* Featured Collections */}
                        <div className="space-y-6">
                            <div className="text-xs font-semibold text-red-400 uppercase tracking-[0.2em]">
                                Featured Collections
                            </div>
                            
                            {loading ? (
                                <div className="space-y-8 animate-pulse px-2 mt-8">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-black/5 pb-2">
                                            <div className="h-4 bg-black/10 rounded w-1/2"></div>
                                            <div className="h-3 bg-black/10 rounded w-4"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : collections.length > 0 ? (
                                <div className="space-y-6">
                                    {collections.map((collection) => (
                                        <Link 
                                            key={collection._id}
                                            href={`/collections/${collection.slug}`} 
                                            onClick={onClose}
                                            className="flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Star className="w-3 h-3 text-white/40" />
                                                <span className="text-sm uppercase tracking-[0.2em] text-white group-hover:opacity-70 transition-opacity">
                                                    {collection.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-sans">
                                                    {collection.products?.length || 0} items
                                                </span>
                                                <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-white/40 font-sans">No featured collections available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-black/5">
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
                             {/* Socials or other footer items could go here */}
                             <div className="w-2 h-2 rounded-full bg-white/20"></div>
                             <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
