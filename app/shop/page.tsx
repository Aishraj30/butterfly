'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getAllProducts, getProductsByCategory } from '@/lib/db'
import { Sliders, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const categories = ['All', 'Clothing', 'Shoes', 'Accessories']
const sizes = ['XS', 'S', 'M', 'L', 'XL']
const colors = ['Red', 'Blue', 'Green', 'Black', 'White']

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const loadProducts = () => {
      if (selectedCategory === 'All') {
        setProducts(getAllProducts())
      } else {
        setProducts(getProductsByCategory(selectedCategory))
      }
      setLoading(false)
    }
    loadProducts()
  }, [selectedCategory])

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">
              Shop Our Collection
            </h1>
            <p className="text-foreground/60 mt-2">
              Discover our complete range of luxury fashion pieces
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-sm transition-colors ${
                          selectedCategory === cat
                            ? 'font-semibold text-foreground'
                            : 'text-foreground/70 hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className="px-3 py-2 border border-border text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 rounded-sm transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Color</h3>
                <ul className="space-y-2">
                  {colors.map((color) => (
                    <li key={color}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                          {color}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
                <div className="space-y-4">
                  <input type="range" min="0" max="5000" className="w-full" />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-border rounded-sm text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-border rounded-sm text-sm"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex gap-2">
                  <button className="lg:hidden p-2 border border-border rounded-sm text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                    <Sliders size={18} />
                    <span className="text-sm">Filters</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/60">Sort by:</span>
                  <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-sm text-sm text-foreground hover:bg-secondary transition-colors">
                    Newest
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-foreground/60">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-foreground/60">No products found in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group"
                    >
                      <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 rounded-sm aspect-square mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                        <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                          <span className="text-foreground/20 text-sm">Product Image</span>
                        </div>
                        <div className="absolute top-3 right-3 bg-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          {product.category}
                        </div>
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <p className="text-primary font-semibold">
                          ${product.price}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {product.rating} ★
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {/* Load More */}
              <div className="text-center mt-12">
                <button className="px-8 py-3 border border-primary text-primary font-medium rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                  Load More Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
