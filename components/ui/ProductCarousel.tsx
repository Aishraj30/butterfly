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
  images: string[]
}

interface ProductCarouselProps {
  title: string
  products: Product[]
  showAddToCart?: boolean
  showQuickView?: boolean
  shopAllLink?: string
}

export function ProductCarousel({ title, products, showAddToCart = true, showQuickView = true, shopAllLink }: ProductCarouselProps) {
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
    <section className="w-full pt-1 md:pt-1 pb-1 md:pb-1 text-black bg-white">
      <div className="w-full">
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Mobile Grid Layout */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto scrollbar-hide px-2 pb-0 snap-x snap-mandatory scroll-pl-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {products.map((product) => (
                <div key={product.id} className="flex-none w-[80vw] snap-start group border-r border-gray-300 px-1 last:border-r-0">
                  <div className="cursor-pointer group mb-4">
                    {/* Nested Image Scroll */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                      <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {product.images.map((img, idx) => (
                          <div key={idx} className="flex-none w-full h-full snap-start relative">
                            <Image
                              src={img}
                              alt={`${product.name} - ${idx + 1}`}
                              fill
                              className="object-cover object-top"
                            />
                            {/* Dot Indicators */}
                            {product.images.length > 1 && (
                              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                                {product.images.map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1 h-1 rounded-full transition-all duration-300 ${i === idx ? 'bg-white scale-125' : 'bg-white/40'}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Info Below Card (Swiping here scrolls the main carousel) */}
                    <Link href={`/product/${product.id}`}>
                      <div className="mt-4 px-0 pb-6">
                        <div className="flex justify-between items-start mb-1.5">
                          <h3 className="font-bold text-black text-[10px] uppercase tracking-[0.2em] line-clamp-1 pr-2">{product.name}</h3>
                          <p className="font-bold text-black text-[11px] tracking-wide whitespace-nowrap">{product.price}</p>
                        </div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
                          Luxury Collection
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Horizontal Scroll Layout */}
          <div className="hidden md:block">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth px-4 pb-2 pt-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-none w-[calc(25%-2px)] sm:w-[calc(25%-2px)] md:w-[calc(30%-2px)] lg:w-[calc(22%-2px)] group border-r border-gray-300 px-2 last:border-r-0">
                  <div className="cursor-pointer group flex flex-col h-full">
                    {/* Nested Image Scroll */}
                    <div className="relative h-[70vh] overflow-hidden rounded-xl bg-gray-100 group/img">
                      {/* Primary Image */}
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className={`object-cover object-top transition-opacity duration-1000 ${product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:opacity-100'}`}
                        priority
                      />

                      {/* Secondary Image (Hover) */}
                      {product.images.length > 1 && (
                        <Image
                          src={product.images[1]}
                          alt={`${product.name} - Alternate View`}
                          fill
                          className="object-cover object-top absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                        />
                      )}

                      {/* Indicators (Keep them for consistency or remove if preferred) */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                          {product.images.slice(0, 2).map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Info Below Card */}
                    <Link href={`/product/${product.id}`}>
                      <div className="px-0 mt-auto pt-4 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600 transition-colors pr-4">
                            {product.name}
                          </h3>
                          <span className="text-xs font-bold text-black whitespace-nowrap">
                            {product.price}
                          </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                          Luxury Collection
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
