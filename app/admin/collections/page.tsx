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
  ExternalLink
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { compressImage, isValidImageFile, formatFileSize } from '@/lib/imageCompression'

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
  isFeatured: boolean
  isActive: boolean
}

export default function AdminCollectionsPage() {
  const { token } = useAuth()
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
          bannerImage: data.url
        }))
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

    try {
      const url = editingId ? `/api/collections/${editingId}` : '/api/collections'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        fetchCollections()
        resetForm()
      } else {
        alert(data.message || 'Action failed')
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
      isFeatured: false,
      isActive: true,
      products: []
    })
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
    <main className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#003300] mb-2">Collections Edit</h1>
            <p className="text-gray-500">Curate and manage your luxury fashion collections</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-[#003300] text-white rounded-full font-medium hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Create Collection
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#D7C69D] outline-none transition-all"
          />
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="animate-spin text-[#D7C69D]" size={40} />
            </div>
          ) : filteredCollections.map((col) => (
            <div
              key={col._id}
              className="group bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-6 right-6 flex gap-2">
                {col.isFeatured && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                    <Plus size={10} /> Featured
                  </span>
                )}
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${col.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                  {col.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden relative border border-gray-50">
                  {col.bannerImage ? (
                    <Image src={col.bannerImage} alt={col.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#003300] mb-1">{col.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mb-2">/{col.slug}</p>
                  <p className="text-sm text-gray-500 line-clamp-1 mb-3">{col.description || 'No description provided'}</p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#003300]">
                    <span className="flex items-center gap-1">
                      <LayoutGrid size={14} /> {col.products.length} Products
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all">
                <Link
                  href={`/collections/${col.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-gray-400 hover:text-[#003300] flex items-center gap-1"
                >
                  View Live <ExternalLink size={12} />
                </Link>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(col)}
                    className="p-2 hover:bg-[#F7E6CA] text-[#003300] rounded-xl transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(col._id)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-over Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-[#003300]/20 backdrop-blur-sm" onClick={resetForm} />
          <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#FDFCF9]">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#003300]">
                  {editingId ? 'Edit Collection' : 'Create Collection'}
                </h2>
                <p className="text-xs text-gray-400">Define your collection details and curate products</p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#003300] uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#D7C69D] outline-none"
                    placeholder="e.g. Summer Edit"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#003300] uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none font-mono text-sm"
                    placeholder="summer-edit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#003300] uppercase tracking-wider">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#D7C69D] outline-none resize-none h-24"
                  placeholder="Tell clients about this collection..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-[#003300] uppercase tracking-wider">Banner Image</label>
                <div className="flex items-center gap-4">
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
                    className="px-4 py-2 border border-[#003300] text-[#003300] hover:bg-gray-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50 text-sm font-bold"
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
                      className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {compressionInfo && (
                  <div className="text-[10px] text-green-600 font-bold bg-green-50 p-2 rounded-lg">
                    {compressionInfo}
                  </div>
                )}

                {formData.bannerImage && (
                  <div className="relative w-full h-40 rounded-2xl bg-gray-100 overflow-hidden border border-gray-50">
                    <Image src={formData.bannerImage} alt="Banner Preview" fill className="object-cover" />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Or enter URL manually</label>
                  <input
                    type="text"
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#D7C69D] outline-none text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isFeatured ? 'bg-amber-400' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isFeatured ? 'left-7' : 'left-1'}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-500 group-hover:text-[#003300]">Featured</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-[#003300]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-500 group-hover:text-[#003300]">Active</span>
                </label>
              </div>

              {/* Product Selector Section */}
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#003300] uppercase tracking-wider">Select Products ({formData.products.length})</label>
                  <button
                    type="button"
                    onClick={() => setShowProductSelector(!showProductSelector)}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    {showProductSelector ? 'Hide List' : 'Add Products'}
                  </button>
                </div>

                {showProductSelector && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-sm outline-none shadow-sm"
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {filteredProducts.map(product => (
                        <div
                          key={product._id}
                          onClick={() => toggleProduct(product._id)}
                          className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${formData.products.includes(product._id)
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-white border-gray-50 hover:border-amber-100'
                            }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden border border-gray-50">
                            {product.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-gray-300"><ImageIcon size={16} /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#003300] truncate">{product.name}</p>
                            <p className="text-[10px] text-gray-400">{product.category} • ₹{product.price}</p>
                          </div>
                          {formData.products.includes(product._id) && (
                            <div className="bg-amber-400 p-1 rounded-full"><Check size={12} className="text-white" /></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Preview */}
                {!showProductSelector && formData.products.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.products.map(id => {
                      const p = allProducts.find(prod => prod._id === id)
                      if (!p) return null
                      return (
                        <div key={id} className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold text-[#003300] flex items-center gap-2">
                          {p.name}
                          <button type="button" onClick={() => toggleProduct(id)}><X size={10} /></button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </form>

            <div className="p-8 border-t border-gray-50 bg-[#FDFCF9] flex gap-4">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-[#003300] text-white rounded-2xl font-bold shadow-xl shadow-[#003300]/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingId ? 'Update Collection' : 'Create Collection'}
              </button>
            </div>
          </div>
        </div>
      )
      }

      <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #D7C69D;
        border-radius: 10px;
      }
    `}</style>
    </main >
  )
}
