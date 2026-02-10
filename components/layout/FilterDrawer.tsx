'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterDrawerProps {
    isOpen: boolean
    onClose: () => void
    onApplyFilters: (filters: FilterState) => void
    initialFilters?: FilterState
}

export interface FilterState {
    genders: string[]
    sizes: string[]
    priceRange: { min: number | string | null; max: number | string | null }
    colors: string[]
    sortBy: 'name' | 'price-low' | 'price-high' | 'rating'
}

export function FilterDrawer({ isOpen, onClose, onApplyFilters, initialFilters }: FilterDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const [expandedSections, setExpandedSections] = useState<string[]>(['gender', 'size', 'price', 'color', 'sort'])
    const [selectedGenders, setSelectedGenders] = useState<string[]>(initialFilters?.genders || [])
    const [selectedSizes, setSelectedSizes] = useState<string[]>(initialFilters?.sizes || [])
    const [priceRange, setPriceRange] = useState({
        min: initialFilters?.priceRange.min?.toString() || '',
        max: initialFilters?.priceRange.max?.toString() || ''
    })
    const [selectedColors, setSelectedColors] = useState<string[]>(initialFilters?.colors || [])
    const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>(initialFilters?.sortBy || 'name')

    // Sync state if initialFilters changes
    useEffect(() => {
        if (initialFilters) {
            setSelectedGenders(initialFilters.genders)
            setSelectedSizes(initialFilters.sizes)
            setPriceRange({
                min: initialFilters.priceRange.min?.toString() || '',
                max: initialFilters.priceRange.max?.toString() || ''
            })
            setSelectedColors(initialFilters.colors)
            setSortBy(initialFilters.sortBy)
        }
    }, [initialFilters])

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

    const toggleGender = (gender: string) => {
        setSelectedGenders(prev =>
            prev.includes(gender)
                ? prev.filter(g => g !== gender)
                : [...prev, gender]
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
        setSelectedGenders([])
        setSelectedSizes([])
        setSelectedColors([])
        setPriceRange({ min: '', max: '' })
        setSortBy('name')
    }

    const applyFilters = () => {
        onApplyFilters({
            genders: selectedGenders,
            sizes: selectedSizes,
            priceRange: {
                min: priceRange.min ? parseInt(priceRange.min) : null,
                max: priceRange.max ? parseInt(priceRange.max) : null
            },
            colors: selectedColors,
            sortBy
        })
        onClose()
    }

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                ref={backdropRef}
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm cursor-pointer transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 z-[101] h-screen w-full max-w-[400px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex h-full flex-col font-sans">
                    {/* Header - Sleek & Minimal */}
                    <div className="flex items-center justify-between px-8 py-7 bg-white">
                        <div>
                            <h2 className="text-lg font-bold uppercase tracking-[0.25em] text-black">
                                Refine
                            </h2>
                            <div className="h-0.5 w-8 bg-black mt-1" />
                        </div>
                        <button
                            onClick={onClose}
                            className="group relative h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-50"
                        >
                            <X size={20} className="transition-transform duration-500 group-hover:rotate-90 text-black/70 group-hover:text-black" />
                        </button>
                    </div>

                    {/* Body - Organized & Spacious */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="px-8 py-4 space-y-10 group/container">

                            {/* Gender Selection */}
                            <section className="space-y-5">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black/40">Selection</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Male', 'Female', 'Unisex'].map((gender) => (
                                        <button
                                            key={gender}
                                            onClick={() => toggleGender(gender)}
                                            className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest border transition-all duration-300 ${selectedGenders.includes(gender)
                                                ? 'bg-black text-white border-black shadow-md'
                                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-black'
                                                }`}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                            {/* Size Selection */}
                            <section className="space-y-5">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black/40">Size</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`py-3 text-[10px] font-bold tracking-tighter border transition-all duration-300 ${selectedSizes.includes(size)
                                                ? 'bg-black text-white border-black scale-[1.02]'
                                                : 'bg-gray-50/50 text-gray-400 border-transparent hover:border-gray-200 hover:text-black hover:bg-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                            {/* Price Selection */}
                            <section className="space-y-5">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black/40">Price Range</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="w-full pl-8 pr-4 py-3 text-xs bg-gray-50/50 border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="w-full pl-8 pr-4 py-3 text-xs bg-gray-50/50 border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                            {/* Color Selection */}
                            <section className="space-y-5">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black/40">Palette</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Black', 'White', 'Gray', 'Brown', 'Blue', 'Red', 'Navy', 'Cream', 'Gold', 'Camel'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => toggleColor(color)}
                                            title={color}
                                            className={`relative w-8 h-8 rounded-full border transition-all duration-300 ring-offset-2 ${selectedColors.includes(color)
                                                ? 'ring-1 ring-gray-400 border-black scale-110'
                                                : 'border-transparent hover:scale-110'
                                                }`}
                                            style={{
                                                backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                                    color.toLowerCase() === 'black' ? '#000000' :
                                                        color.toLowerCase() === 'gray' ? '#6b7280' :
                                                            color.toLowerCase() === 'brown' ? '#92400e' :
                                                                color.toLowerCase() === 'blue' ? '#2563eb' :
                                                                    color.toLowerCase() === 'red' ? '#dc2626' :
                                                                        color.toLowerCase() === 'navy' ? '#001f3f' :
                                                                            color.toLowerCase() === 'cream' ? '#fffdd0' :
                                                                                color.toLowerCase() === 'gold' ? '#ffd700' :
                                                                                    color.toLowerCase() === 'camel' ? '#c19a6b' : '#000000'
                                            }}
                                        >
                                            {color === 'White' && <div className="absolute inset-0 rounded-full border border-gray-100" />}
                                            {selectedColors.includes(color) && (
                                                <div className={`absolute inset-0 flex items-center justify-center`}>
                                                    <div className={`w-1 h-1 rounded-full ${['White', 'Cream', 'Gold'].includes(color) ? 'bg-black' : 'bg-white'}`} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                            {/* Sort Selection */}
                            <section className="space-y-5 pb-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black/40">Sort By</h3>
                                <div className="space-y-1">
                                    {[
                                        { value: 'name', label: 'Featured' },
                                        { value: 'price-low', label: 'Price: Low to High' },
                                        { value: 'price-high', label: 'Price: High to Low' },
                                        { value: 'rating', label: 'Recommended' }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value as any)}
                                            className="flex items-center w-full py-3 group transition-all"
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 mr-4 ${sortBy === option.value ? 'border-black bg-black' : 'border-gray-200 group-hover:border-gray-400'}`}>
                                                {sortBy === option.value && <div className="w-1 h-1 rounded-full bg-white" />}
                                            </div>
                                            <span className={`text-xs uppercase tracking-widest transition-colors duration-300 ${sortBy === option.value ? 'text-black font-bold' : 'text-gray-400 group-hover:text-black'}`}>
                                                {option.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer - Elegant Controls */}
                    <div className="px-8 py-8 bg-white border-t border-gray-50 flex gap-4">
                        <button
                            onClick={clearAllFilters}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors border border-transparent hover:border-gray-100"
                        >
                            Reset
                        </button>
                        <button
                            onClick={applyFilters}
                            className="flex-[2] bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
                        >
                            Update Results
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
