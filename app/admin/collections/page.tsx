'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  X,
  Image as ImageIcon,
  Check,
  Loader2,
  LayoutGrid,
  ExternalLink,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { compressImage, isValidImageFile, formatFileSize } from '@/lib/imageCompression'
import { AIBannerEnhancer } from '@/components/admin/AIBannerEnhancer'
import { AIVariant, BannerEnhancement } from '@/lib/ai-enhancement'

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  inStock: boolean
}

interface Collection {
  _id: string
  name: string
  slug: string
  description?: string
  products: Product[]
  bannerImage?: string
  aiVariants?: AIVariant[]
  selectedVariant?: string | null
  aiEnhanced?: boolean
  isFeatured: boolean
  isActive: boolean
}

export default function AdminCollectionsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [collections, setCollections] = useState<Collection[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Form State
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    bannerImage: '',
    aiVariants: [] as AIVariant[],
    selectedVariant: null as string | null,
    aiEnhanced: false,
    isFeatured: false,
    isActive: true,
    products: [] as string[]
  })

  // Product Selection State
  const [productSearch, setProductSearch] = useState('')
  const [showProductSelector, setShowProductSelector] = useState(false)

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState('')
  const [showAIEnhancer, setShowAIEnhancer] = useState(false)

  useEffect(() => {
    if (token) {
      fetchCollections()
      fetchAllProducts()
    }
  }, [token])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setCollections(data.collections)
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setAllProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    setFormData({ ...formData, name, slug })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isValidImageFile(file)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }

    setUploadingImage(true)
    setCompressionInfo('')

    try {
      const compressedFile = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        quality: 0.8,
        useWebWorker: true
      })

      const originalSize = formatFileSize(file.size)
      const compressedSize = formatFileSize(compressedFile.size)
      const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
      setCompressionInfo(`Original: ${originalSize} → Compressed: ${compressedSize} (${compressionRatio}% reduction)`)

      const formDataUpload = new FormData()
      formDataUpload.append('file', compressedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          bannerImage: data.url,
          selectedVariant: null, // Reset selected variant when new image is uploaded
          aiEnhanced: false,
          aiVariants: []
        }))
        // Automatically open AI Enhancer after successful upload
        setShowAIEnhancer(true)
      } else {
        alert(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('Form data being submitted:', formData)
    console.log('Editing ID:', editingId)

    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Collection name is required",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Collection slug is required",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    try {
      const url = editingId ? `/api/collections/${editingId}` : '/api/collections'
      const method = editingId ? 'PUT' : 'POST'
      
      console.log('Request URL:', url)
      console.log('Request method:', method)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      if (data.success) {
        fetchCollections()
        resetForm()
        toast({
          title: editingId ? "Collection Updated" : "Collection Created",
          description: `Collection "${formData.name}" has been ${editingId ? 'updated' : 'created'} successfully.`,
        })
      } else {
        toast({
          title: "Error",
          description: data.message || 'Action failed',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving collection:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (col: Collection) => {
    setEditingId(col._id)
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || '',
      bannerImage: col.bannerImage || '',
      aiVariants: col.aiVariants || [],
      selectedVariant: col.selectedVariant || null,
      aiEnhanced: col.aiEnhanced || false,
      isFeatured: col.isFeatured,
      isActive: col.isActive,
      products: col.products.map(p => p._id)
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) fetchCollections()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      bannerImage: '',
      aiVariants: [],
      selectedVariant: null,
      aiEnhanced: false,
      isFeatured: false,
      isActive: true,
      products: []
    })
  }

  const handleAIVariantSelect = (variant: AIVariant) => {
    setFormData(prev => ({
      ...prev,
      selectedVariant: variant.url,
      aiEnhanced: true
    }))
  }

  const handleAIEnhancementComplete = (enhancement: BannerEnhancement) => {
    setFormData(prev => ({
      ...prev,
      aiVariants: enhancement.variants,
      aiEnhanced: true
    }))
    // Keep the enhancer open so they can see variants, 
    // or close it if they already selected one.
    // For now, let's keep it open to allow selection.
  }

  const toggleProduct = (productId: string) => {
    const current = [...formData.products]
    const index = current.indexOf(productId)
    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(productId)
    }
    setFormData({ ...formData, products: current })
  }

  const filteredCollections = collections.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              Collections
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your fashion collections</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black border border-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <Plus size={18} />
            New Collection
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Collections Grid */}
        <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                    Collection
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Loading collections...
                    </td>
                  </tr>
                ) : filteredCollections.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No collections found.
                    </td>
                  </tr>
                ) : (
                  filteredCollections.map((col) => (
                    <tr
                      key={col._id}
                      className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {col.bannerImage && (
                            <div className="w-10 h-10 rounded-sm overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                              <img src={col.bannerImage} alt={col.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-black dark:text-white">{col.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{col.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {col.products?.length || 0} products
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {col.isFeatured && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              Featured
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            col.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {col.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(col)} 
                            className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(col._id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
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
      </div>

      {/* Slide-over Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" onClick={resetForm} />
          <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white dark:bg-black shadow-xl flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  {editingId ? 'Edit Collection' : 'Create Collection'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Define your collection details</p>
              </div>
              <button onClick={resetForm} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black dark:text-white">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white"
                    placeholder="Collection name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black dark:text-white">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white font-mono text-sm"
                    placeholder="collection-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white resize-none h-24"
                  placeholder="Collection description..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-black dark:text-white">Banner Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 text-sm font-medium"
                  >
                    {uploadingImage ? 'Uploading...' : 'Choose Image'}
                  </label>
                  {formData.bannerImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, bannerImage: '' })
                        setCompressionInfo('')
                      }}
                      className="px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {compressionInfo && (
                  <div className="text-sm text-green-600 font-medium bg-green-50 p-3 rounded-lg">
                    {compressionInfo}
                  </div>
                )}
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>
            </form>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Collection' : 'Create Collection')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
