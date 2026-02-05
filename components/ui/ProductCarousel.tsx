'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './button'

interface Product {
  id: string
  name: string
  price: string
  image: string
}

interface ProductCarouselProps {
  title: string
  products: Product[]
  showAddToCart?: boolean
  showQuickView?: boolean
}

export function ProductCarousel({ title, products, showAddToCart = true, showQuickView = true }: ProductCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const container = carouselRef.current
    if (!container) return

    const scrollAmount = 400
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount

    container.scrollTo({
      left: newPosition,
      behavior: 'auto'
    })
    setScrollPosition(newPosition)
  }

  return (
    <section className="w-full py-16 md:py-24 text-black min-h-screen bg-white">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth'
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-64 md:w-80 lg:w-96 group">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="mt-6 text-center">
                    <h3 className="font-semibold text-base md:text-lg mb-2">{product.name}</h3>
                    <p className="font-bold text-lg md:text-xl">{product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
