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
    <section className="w-full pt-1 md:pt-2 pb-1 md:pb-1 text-black bg-white">
      <div className="w-full">
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Mobile Grid Layout */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-4 p-2">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="group">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Product Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                          <h3 className="font-normal text-white/90 text-xs mb-1 tracking-wide">{product.name}</h3>
                          <p className="font-normal text-white/90 text-sm tracking-wide">{product.price}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Horizontal Scroll Layout */}
          <div className="hidden md:block">
            <div
              ref={carouselRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pl-0.5 md:pl-1 lg:pl-1.5 pb-1"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth'
              }}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-none w-[calc(25%-12px)] sm:w-[calc(25%-18px)] md:w-[calc(25%-24px)] lg:w-[calc(25%-27px)] group h-full">
                  <Link href={`/product/${product.id}`} className="block h-full">
                    <div className="relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer h-full">
                      {/* Product Image */}
                      <div className="relative h-[92vh] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Product Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
                          <h3 className="font-normal text-white/90 text-xs md:text-sm mb-1 tracking-wide">{product.name}</h3>
                          <p className="font-normal text-white/90 text-sm md:text-base tracking-wide">{product.price}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
