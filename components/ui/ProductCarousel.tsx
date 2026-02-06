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
    <section className="w-full pt-4 md:pt-2 pb-4 md:pb-2 text-black bg-white">
      <div className="w-full">
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pl-0.5 md:pl-1 lg:pl-1.5"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth'
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-64 md:w-80 lg:w-96 xl:w-[28rem] group">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer">
                    {/* Product Image */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Product Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="font-normal text-white text-sm md:text-base mb-1">{product.name}</h3>
                        <p className="font-normal text-white text-base md:text-lg">{product.price}</p>
                      </div>
                    </div>
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
