'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, ChevronDown, Filter } from 'lucide-react'
import { Suspense } from 'react'
import { Product } from '@/lib/products'

const Loading = () => <div className="p-8 text-center text-foreground/60">Loading products...</div>

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchProducts() // Refresh list
        setSelectedProducts(prev => prev.filter(p => p !== id))
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <main className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="bg-secondary border-b border-border sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-primary">
                    Products
                  </h1>
                  <p className="text-foreground/60 text-sm mt-1">
                    Manage your product inventory and details
                  </p>
                </div>
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus size={18} />
                  New Product
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
            {/* Toolbar */}
            <div className="bg-background border border-border rounded-sm p-4 mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search products by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors">
                  <Filter size={18} />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors">
                  Sort By
                  <ChevronDown size={16} />
                </button>
              </div>

              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-foreground/60">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </span>
                  <button className="px-3 py-1 text-destructive font-medium hover:bg-destructive/10 rounded-sm transition-colors">
                    Delete Selected
                  </button>
                </div>
              )}
            </div>

            {/* Products Table */}
            <div className="bg-background border border-border rounded-sm overflow-hidden text-black">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left w-12">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-foreground/60">
                          Loading products...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-foreground/60">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-border hover:bg-secondary/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => toggleSelectProduct(product.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* Optional Image Thumbnail */}
                              <div className={`w-10 h-10 rounded-sm bg-secondary ${product.image}`}></div>
                              <p className="font-medium text-foreground">
                                {product.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground/60">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`font-medium ${!product.inStock
                                ? 'text-destructive'
                                : 'text-green-600'
                              }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-foreground">
                            ${product.price ? product.price.toLocaleString() : '0.00'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.inStock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                              {product.inStock ? 'Active' : 'Allocated'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Add Link to Edit Page */}
                              <Link href={`/admin/products/${product.id}`} className="p-2 text-primary hover:bg-secondary rounded-sm transition-colors">
                                <Edit size={18} />
                              </Link>
                              <button onClick={() => handleDelete(product.id)} className="p-2 text-destructive hover:bg-secondary rounded-sm transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls could go here */}
          </div>
        </main>
      </div>
    </Suspense>
  )
}
