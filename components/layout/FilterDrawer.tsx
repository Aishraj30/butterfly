'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    
    const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'size', 'price', 'color'])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [selectedColors, setSelectedColors] = useState<string[]>([])

    // Prevent body scroll when filter is open
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

    const toggleSection = (section: string) => {
        setExpandedSections(prev => 
            prev.includes(section) 
                ? prev.filter(s => s !== section)
                : [...prev, section]
        )
    }

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    const toggleSize = (size: string) => {
        setSelectedSizes(prev => 
            prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size]
        )
    }

    const toggleColor = (color: string) => {
        setSelectedColors(prev => 
            prev.includes(color) 
                ? prev.filter(c => c !== color)
                : [...prev, color]
        )
    }

    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedSizes([])
        setSelectedColors([])
        setPriceRange({ min: '', max: '' })
    }

    const applyFilters = () => {
        // Handle filter application logic here
        onClose()
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
                className={`fixed top-0 right-0 z-[101] h-screen w-full max-w-[480px] bg-white shadow-2xl transition-transform duration-500 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-8 py-6">
                        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-black">
                            Filter & Sort
                        </h2>
                        <button
                            onClick={onClose}
                            className="group rounded-full p-2 transition-colors hover:bg-gray-100 cursor-pointer bg-gray-100"
                        >
                            <X size={24} className="transition-transform duration-300 group-hover:rotate-90 text-black" />
                        </button>
                    </div>

                    {/* Body */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto">
                        <div className="p-8 space-y-6">
                            
                            {/* Category Filter */}
                            <div className="border-b pb-6">
                                <button
                                    onClick={() => toggleSection('category')}
                                    className="flex items-center justify-between w-full text-left mb-4 cursor-pointer"
                                >
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Category</h3>
                                    <ChevronDown 
                                        size={16} 
                                        className={`transition-transform duration-200 ${
                                            expandedSections.includes('category') ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {expandedSections.includes('category') && (
                                    <div className="space-y-3">
                                        {['Woman', 'Man', 'Unisex'].map((category) => (
                                            <label key={category} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() => toggleCategory(category)}
                                                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                                />
                                                <span className="text-sm text-gray-700">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Size Filter */}
                            <div className="border-b pb-6">
                                <button
                                    onClick={() => toggleSection('size')}
                                    className="flex items-center justify-between w-full text-left mb-4 cursor-pointer"
                                >
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Size</h3>
                                    <ChevronDown 
                                        size={16} 
                                        className={`transition-transform duration-200 ${
                                            expandedSections.includes('size') ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {expandedSections.includes('size') && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => toggleSize(size)}
                                                className={`py-2 px-3 text-xs font-medium border transition-colors ${
                                                    selectedSizes.includes(size)
                                                        ? 'bg-black text-white border-black'
                                                        : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Price Filter */}
                            <div className="border-b pb-6">
                                <button
                                    onClick={() => toggleSection('price')}
                                    className="flex items-center justify-between w-full text-left mb-4 cursor-pointer"
                                >
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Price</h3>
                                    <ChevronDown 
                                        size={16} 
                                        className={`transition-transform duration-200 ${
                                            expandedSections.includes('price') ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {expandedSections.includes('price') && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                                            />
                                            <span className="text-gray-500">-</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Color Filter */}
                            <div className="pb-6">
                                <button
                                    onClick={() => toggleSection('color')}
                                    className="flex items-center justify-between w-full text-left mb-4 cursor-pointer"
                                >
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Color</h3>
                                    <ChevronDown 
                                        size={16} 
                                        className={`transition-transform duration-200 ${
                                            expandedSections.includes('color') ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {expandedSections.includes('color') && (
                                    <div className="grid grid-cols-6 gap-3">
                                        {['Black', 'White', 'Gray', 'Brown', 'Blue', 'Red'].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => toggleColor(color)}
                                                className={`relative group cursor-pointer`}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                        selectedColors.includes(color)
                                                            ? 'border-black ring-2 ring-offset-2 ring-black'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                    style={{
                                                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                                                        color.toLowerCase() === 'black' ? '#000000' :
                                                                        color.toLowerCase() === 'gray' ? '#6b7280' :
                                                                        color.toLowerCase() === 'brown' ? '#92400e' :
                                                                        color.toLowerCase() === 'blue' ? '#2563eb' :
                                                                        color.toLowerCase() === 'red' ? '#dc2626' : '#000000'
                                                    }}
                                                />
                                                {color === 'White' && (
                                                    <div className="absolute inset-0 rounded-full border border-gray-300" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t p-8 bg-gray-50/50 space-y-4">
                        <button
                            onClick={clearAllFilters}
                            className="w-full py-3 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                        >
                            Clear All Filters
                        </button>
                        <button
                            onClick={applyFilters}
                            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
