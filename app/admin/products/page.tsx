'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Plus, Edit, Trash2, ChevronDown, Filter } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const mockProducts = [
  { id: 1, name: 'Silk Butterfly Gown', sku: 'SBG-001', stock: 45, price: 1250, status: 'Active' },
  { id: 2, name: 'Crystal Embellished Dress', sku: 'CED-001', stock: 23, price: 980, status: 'Active' },
  { id: 3, name: 'Ethereal Drape Jacket', sku: 'EDJ-001', stock: 67, price: 750, status: 'Active' },
  { id: 4, name: 'Luxe Structured Blazer', sku: 'LSB-001', stock: 12, price: 890, status: 'Low Stock' },
  { id: 5, name: 'Silk Charmeuse Blouse', sku: 'SCB-001', stock: 89, price: 520, status: 'Active' },
  { id: 6, name: 'Premium Wool Coat', sku: 'PWC-001', stock: 0, price: 1450, status: 'Out of Stock' },
]

const Loading = () => null

export default function AdminProductsPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
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

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
            {/* Toolbar */}
            <div className="bg-background border border-border rounded-sm p-4 mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
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
            <div className="bg-background border border-border rounded-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left">
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
                      SKU
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
                  {filteredProducts.map((product) => (
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
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/60">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-medium ${
                          product.stock === 0
                            ? 'text-destructive'
                            : product.stock < 20
                              ? 'text-orange-600'
                              : 'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          product.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'Low Stock'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-primary hover:bg-secondary rounded-sm transition-colors">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 text-destructive hover:bg-secondary rounded-sm transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-foreground/60">
                Showing {filteredProducts.length} of {mockProducts.length} products
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-2 border border-border rounded-sm hover:bg-secondary transition-colors disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors">
                  1
                </button>
                <button className="px-3 py-2 border border-border rounded-sm hover:bg-secondary transition-colors">
                  2
                </button>
                <button className="px-3 py-2 border border-border rounded-sm hover:bg-secondary transition-colors">
                  3
                </button>
                <button className="px-3 py-2 border border-border rounded-sm hover:bg-secondary transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  )
}
