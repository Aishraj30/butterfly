'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ChevronRight, ChevronDown, Star } from 'lucide-react'

interface FeaturedDrawerProps {
    isOpen: boolean
    onClose: () => void
}

interface Collection {
    id: number
    name: string
    description?: string
    categories?: string[]
    type: 'editors' | 'bestsellers' | 'limited' | 'seasonal' | 'runway'
    featured: boolean
    productCount?: number
}

export function FeaturedDrawer({ isOpen, onClose }: FeaturedDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const [expandedItems, setExpandedItems] = useState<number[]>([])
    const [collections, setCollections] = useState<Collection[]>([])

    // Fetch featured collections from backend
    useEffect(() => {
        fetch('/api/featured-collections')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCollections(data.data)
                }
            })
            .catch(error => console.error('Failed to fetch featured collections:', error))
    }, [])

    // Prevent body scroll when featured drawer is open
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

    const toggleExpanded = (id: number) => {
        setExpandedItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

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
                className={`fixed top-0 left-0 z-[101] h-screen w-full max-w-[480px] bg-white shadow-2xl transition-transform duration-500 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-8 py-6">
                        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-black">
                            Featured
                        </h2>
                        <button
                            onClick={onClose}
                            className="group rounded-full p-2 transition-colors hover:bg-gray-100 cursor-pointer bg-gray-100"
                        >
                            <X size={24} className="transition-transform duration-300 group-hover:rotate-90 text-black" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="space-y-2">
                            {/* Featured Collections */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Featured Collections</h3>
                                
                                {collections.map((collection) => (
                                    <Link 
                                        key={collection.id}
                                        href={`/featured/${collection.type}`} 
                                        onClick={onClose}
                                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group mb-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                                            <span className="font-medium text-black">{collection.name}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                                    </Link>
                                ))}
                            </div>

                            <div className="border-t my-4"></div>

                            {/* All Featured Link */}
                            <div className="mt-8 pt-6 border-t">
                                <Link 
                                    href="/featured" 
                                    onClick={onClose}
                                    className="block w-full bg-black text-white py-4 text-center font-bold tracking-widest hover:bg-gray-800 transition-colors"
                                >
                                    View All Featured
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
