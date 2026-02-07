'use client'

import Link from 'next/link'
import { ShoppingBag, Heart } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const products = [
  {
    id: 1,
    name: 'Silk Butterfly Gown',
    price: '$1,250',
    image: 'bg-gradient-to-br from-blue-100 to-purple-100',
    category: 'Evening Wear',
  },
  {
    id: 2,
    name: 'Crystal Embellished Dress',
    price: '$980',
    image: 'bg-gradient-to-br from-pink-100 to-rose-100',
    category: 'Cocktail',
  },
  {
    id: 3,
    name: 'Ethereal Drape Jacket',
    price: '$750',
    image: 'bg-gradient-to-br from-amber-50 to-orange-100',
    category: 'Jacket',
  },
  {
    id: 4,
    name: 'Luxe Structured Blazer',
    price: '$890',
    image: 'bg-gradient-to-br from-slate-100 to-gray-100',
    category: 'Blazer',
  },
]

export function FeaturedProducts() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const { user } = useAuth()

  const handleWishlistClick = (e: React.MouseEvent, productId: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    
    // TODO: Add actual wishlist functionality here
    console.log('Add to wishlist:', productId)
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Featured Collection
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Handpicked pieces from our latest luxury collection, crafted with meticulous attention to detail.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group cursor-pointer"
            >
              <div
                className="relative overflow-hidden bg-secondary rounded-sm aspect-[3/4] mb-4 transition-all duration-300"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Placeholder Image */}
                <div className={`w-full h-full ${product.image} flex items-center justify-center transition-transform duration-500 ${
                  hoveredId === product.id ? 'scale-105' : 'scale-100'
                }`}>
                  <span className="text-foreground/20 text-sm">Product Image</span>
                </div>

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-primary/0 flex items-end p-4 gap-3 transition-all duration-300 ${
                  hoveredId === product.id ? 'bg-primary/10' : ''
                }`}>
                  <button className={`flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-sm font-medium transition-all duration-300 ${
                    hoveredId === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <ShoppingBag size={18} />
                    Add to Bag
                  </button>
                  <button 
                    onClick={(e) => handleWishlistClick(e, product.id)}
                    className={`p-2 border border-primary text-primary rounded-sm hover:bg-primary/5 transition-all duration-300 ${
                      hoveredId === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <Heart size={18} />
                  </button>
                </div>

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-foreground/60 text-sm font-light">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 border border-primary text-primary font-medium rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 h-screen">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 space-y-4 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-black">Login Required</h3>
            <p className="text-gray-600">Please login to add items to your wishlist.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-black rounded font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <Link
                href="/login"
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 px-4 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors text-center"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
