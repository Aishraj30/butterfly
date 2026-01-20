'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductGallery } from '@/components/product/ProductGallery'
import { useCart } from '@/hooks/useCart'
import { getProductById } from '@/lib/db'
import { Heart, Share2, ShoppingBag, Minus, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { addToCart } = useCart()

  const product = getProductById(params.id)

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-foreground/60 mb-6">Product not found</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage('Please select a size')
      return
    }
    if (!selectedColor) {
      setMessage('Please select a color')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await addToCart(product.id, quantity, selectedSize, selectedColor)
      setMessage(`✓ Added to cart!`)
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage('Failed to add to cart')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 text-sm text-foreground/60">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <ProductGallery productName={product.name} />

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="font-serif text-4xl font-bold text-primary mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-foreground">
                    ${product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex text-accent">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <span className="text-sm text-foreground/60">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground/70 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-3 font-medium text-sm rounded-sm transition-colors ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border border-border text-foreground hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-3 font-medium text-sm rounded-sm transition-colors ${
                        selectedColor === color
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border border-border text-foreground hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-2 border border-border rounded-sm w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-secondary transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-secondary transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag size={20} />
                {loading ? 'Adding...' : 'Add to Bag'}
              </button>
              {message && (
                <p className={`text-sm font-medium text-center ${message.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
                <button className="p-4 border border-border rounded-sm hover:bg-secondary transition-colors">
                  <Heart size={20} />
                </button>
                <button className="p-4 border border-border rounded-sm hover:bg-secondary transition-colors">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Details */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-3">Product Details</h3>
                <ul className="space-y-2">
                  {product.details.map((detail, i) => (
                    <li key={i} className="text-sm text-foreground/70 flex gap-3">
                      <span className="text-primary">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="bg-secondary border border-border rounded-sm p-4 space-y-3">
                <div className="font-semibold text-sm">Free Shipping & Easy Returns</div>
                <p className="text-xs text-foreground/70">
                  Complimentary worldwide shipping on orders over $500. Returns accepted within 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <h2 className="font-serif text-3xl font-bold text-primary mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.relatedProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/product/${prod.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-secondary rounded-sm mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <span className="text-foreground/20">Product Image</span>
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                    {prod.name}
                  </h3>
                  <p className="text-foreground/60 text-sm">
                    ${prod.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
