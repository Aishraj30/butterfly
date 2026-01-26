'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react'

interface Collection {
  id: number
  name: string
  description?: string
  categories?: string[]
  productCount?: number
}

export default function AdminCollectionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [collectionProducts, setCollectionProducts] = useState<any[]>([])
  const [showProductsModal, setShowProductsModal] = useState(false)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections')
      const data = await response.json()
      if (data.success) {
        setCollections(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCollection
        ? `/api/collections`
        : '/api/collections'
      const method = editingCollection ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCollection?.id,
          ...formData,
        }),
      })

      const data = await response.json()
      if (data.success) {
        fetchCollections()
        setShowForm(false)
        setEditingCollection(null)
        setFormData({ name: '', description: '' })
      } else {
        alert(data.error || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error saving collection:', error)
      alert('Failed to save collection')
    }
  }

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection)
    setFormData({ 
      name: collection.name, 
      description: collection.description || '' 
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      const response = await fetch(`/api/collections?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchCollections()
      } else {
        alert('Failed to delete collection')
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
    }
  }

  const handleViewProducts = async (collection: Collection) => {
    setSelectedCollection(collection)
    try {
      // Build URL with collection categories
      const params = new URLSearchParams()
      params.set('action', 'products')
      if (collection.categories) {
        collection.categories.forEach((cat) => {
          params.append('category', cat)
        })
      }
      
      const response = await fetch(
        `/api/collections/products?${params.toString()}`
      )
      const data = await response.json()
      if (data.success) {
        setCollectionProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setShowProductsModal(true)
  }

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-secondary border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary">
                  Collections
                </h1>
                <p className="text-foreground/60 text-sm mt-1">
                  Manage product collections (Blouse, Jeans, etc.)
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(true)
                  setEditingCollection(null)
                  setFormData({ name: '', description: '' })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                New Collection
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
          {/* Form Section */}
          {showForm && (
            <div className="bg-background border border-border rounded-sm p-6 mb-6">
              <h2 className="font-semibold text-lg text-foreground mb-4">
                {editingCollection ? 'Edit Collection' : 'Create New Collection'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Blouse, Jeans, Jacket"
                    className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    placeholder="e.g., Premium blouses for various occasions"
                    className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    {editingCollection ? 'Update' : 'Create'} Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCollection(null)
                      setFormData({ name: '', description: '' })
                    }}
                    className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search Section */}
          <div className="bg-background border border-border rounded-sm p-4 mb-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40"
              />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-8 text-foreground/60">
                Loading collections...
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="col-span-full text-center py-8 text-foreground/60">
                No collections found.
              </div>
            ) : (
              filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="bg-background border border-border rounded-sm p-6 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-sm">
                        <Package size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {collection.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  {collection.description && (
                    <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                  )}

                  <div className="mb-4 p-3 bg-secondary rounded-sm">
                    <p className="text-sm font-medium text-foreground/60">
                      Product Count
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {collection.productCount || 0}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProducts(collection)}
                      className="flex-1 px-3 py-2 bg-secondary text-foreground font-medium rounded-sm hover:bg-secondary/80 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Package size={16} />
                      View Products
                    </button>
                    <button
                      onClick={() => handleEdit(collection)}
                      className="p-2 text-primary hover:bg-secondary rounded-sm transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(collection.id)}
                      className="p-2 text-destructive hover:bg-secondary rounded-sm transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Products Modal */}
      {showProductsModal && selectedCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-sm p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Products in {selectedCollection.name}
              </h2>
              <button
                onClick={() => setShowProductsModal(false)}
                className="text-foreground/60 hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {collectionProducts.length === 0 ? (
              <p className="text-foreground/60 text-center py-8">
                No products in this collection yet.
              </p>
            ) : (
              <div className="space-y-2">
                {collectionProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-sm hover:bg-secondary/80 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {product.name}
                      </p>
                      <p className="text-sm text-foreground/60">
                        Price: ₹{product.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.inStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
