'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useCart } from '@/hooks/useCart'
import { getProductById } from '@/lib/db'
import Link from 'next/link'
import { Trash2, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { cart, isLoading, removeFromCart, updateQuantity } = useCart()
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<any>({})

  useEffect(() => {
    setMounted(true)
    // Fetch product details for items in cart
    const loadProducts = async () => {
      const productDetails: any = {}
      for (const item of cart.items) {
        const product = getProductById(item.productId)
        if (product) {
          productDetails[item.productId] = product
        }
      }
      setProducts(productDetails)
    }
    loadProducts()
  }, [cart.items])

  if (!mounted || isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground/60">Loading cart...</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">
              Shopping Bag
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {cart.items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-foreground/60 mb-6">Your bag is empty</p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => {
                  const product = products[item.productId]
                  if (!product) return null

                  return (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 border border-border rounded-sm"
                    >
                      {/* Image */}
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-sm aspect-square flex items-center justify-center">
                        <span className="text-foreground/20 text-sm">Product Image</span>
                      </div>

                      {/* Details */}
                      <div className="sm:col-span-2 space-y-2">
                        <h3 className="font-medium text-foreground">
                          {product.name}
                        </h3>
                        <p className="text-sm text-foreground/60">
                          Size: <span className="font-medium">{item.size}</span>
                        </p>
                        <p className="text-sm text-foreground/60">
                          Color: <span className="font-medium">{item.color}</span>
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            className="px-2 py-1 border border-border rounded-sm hover:bg-secondary transition-colors text-sm"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            className="px-2 py-1 border border-border rounded-sm hover:bg-secondary transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-lg font-semibold text-foreground">
                          ${(product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size, item.color)}
                          className="p-2 text-destructive hover:bg-secondary rounded-sm transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="border border-border rounded-sm p-6 space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-primary">
                    Order Summary
                  </h2>

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Subtotal</span>
                      <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Shipping</span>
                      <span className="font-medium">
                        {cart.shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${cart.shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Tax</span>
                      <span className="font-medium">${cart.tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${cart.total.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors mt-6"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Link>
                </div>

                {/* Free Shipping Info */}
                {cart.subtotal < 500 && (
                  <div className="bg-secondary border border-border rounded-sm p-4">
                    <p className="text-sm text-foreground/70">
                      Free shipping on orders over <span className="font-semibold text-foreground">$500</span>
                    </p>
                    <p className="text-sm text-foreground/70 mt-2">
                      Add <span className="font-semibold text-primary">${(500 - cart.subtotal).toFixed(2)}</span> more to qualify
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
