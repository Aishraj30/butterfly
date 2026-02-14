'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products'
import { Category } from '@/lib/categories'
import { Brand } from '@/lib/brands'
import { compressImage, isValidImageFile, formatFileSize } from '@/lib/imageCompression'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Trash2, Loader2, Upload } from 'lucide-react'

interface Collection {
    id: number
    name: string
    description?: string
    categories?: string[]
}

interface ProductFormProps {
    initialData?: Product
    isEdit?: boolean
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [collections, setCollections] = useState<Collection[]>([])
    const [styleCategories, setStyleCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [formData, setFormData] = useState<Partial<Product>>(
        initialData || {
            name: '',
            price: 0,
            category: '',
            subCategory: '',
            gender: 'Unisex',
            brand: '',
            color: '',
            inStock: true,
            image: '', // Will store image URL
            imageUrl: '', // Additional field for uploaded images
            images: [], // Array for multiple images
            size: ['S', 'M', 'L'], // Default sizes
        }
    )
    const [uploadingImage, setUploadingImage] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const [compressionInfo, setCompressionInfo] = useState<string>('')

    useEffect(() => {
        // Fetch collections, categories (styles), and brands
        Promise.all([
            fetch('/api/collections').then(res => res.json()),
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/brands').then(res => res.json())
        ]).then(([collectionsData, styleCategoriesData, brandsData]) => {
            if (collectionsData.success) {
                // Handle different API response formats
                setCollections(collectionsData.collections || collectionsData.data || [])
            }
            if (styleCategoriesData.success) {
                setStyleCategories(styleCategoriesData.data || [])
            }
            if (brandsData.success) {
                setBrands(brandsData.data || [])
            }
        }).catch(error => {
            console.error('Error fetching form data:', error)
        })
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else if (name === 'price') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const { token } = useAuth()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingImage(true)
        setCompressionInfo('')

        try {
            const newImages: string[] = []
            for (const file of Array.from(files)) {
                if (!isValidImageFile(file)) {
                    alert(`${file.name} is not a valid image file. Skipping.`)
                    continue
                }

                // Compress the image before upload
                const compressedFile = await compressImage(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1200, // Reduced slightly for gallery efficiency
                    quality: 0.8,
                    useWebWorker: true
                })

                const uploadFormData = new FormData()
                uploadFormData.append('file', compressedFile)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: uploadFormData
                })

                const data = await response.json()
                if (data.success) {
                    newImages.push(data.url)
                }
            }

            if (newImages.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...newImages],
                    imageUrl: (prev.images || []).length === 0 ? newImages[0] : prev.imageUrl // Set primary if first
                }))
            }
        } catch (error) {
            console.error('Error uploading images:', error)
            alert('Failed to upload some images')
        } finally {
            setUploadingImage(false)
        }
    }

    const removeImage = (index: number) => {
        setFormData(prev => {
            const updatedImages = (prev.images || []).filter((_, i) => i !== index)
            return {
                ...prev,
                images: updatedImages,
                imageUrl: updatedImages[0] || ''
            }
        })
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEdit ? `/api/products/${initialData?.id}` : '/api/products'
            const method = isEdit ? 'PUT' : 'POST'

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
                router.push('/admin/products')
                router.refresh()
            } else {
                alert(data.error || 'Something went wrong')
            }
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-background p-6 rounded-sm border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="1"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Collection</label>
                    <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    >
                        <option value="">Select Collection</option>
                        {collections?.map((collection) => (
                            <option key={collection.id} value={collection.name}>
                                {collection.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Sub-Category (Style)</label>
                    <select
                        name="subCategory"
                        required
                        value={formData.subCategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    >
                        <option value="">Select Style</option>
                        {styleCategories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender || 'Unisex'}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Brand</label>
                    <select
                        name="brand"
                        value={formData.brand || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.name}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Color</label>
                    <input
                        type="text"
                        name="color"
                        required
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => {
                                    const currentSizes = Array.isArray(formData.size) ? formData.size : []
                                    const newSizes = currentSizes.includes(size)
                                        ? currentSizes.filter(s => s !== size)
                                        : [...currentSizes, size]
                                    setFormData(prev => ({ ...prev, size: newSizes }))
                                }}
                                className={`px-4 py-2 rounded-sm font-medium transition-all border-2 ${(Array.isArray(formData.size) ? formData.size : []).includes(size)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'border-border text-foreground hover:border-primary bg-background'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-foreground/60">Click to select available sizes</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Product Gallery (Add 4-5 images)</label>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            {(formData.images || []).map((url, index) => (
                                <div key={index} className="relative group w-32 h-32 border border-border rounded-sm overflow-hidden bg-secondary">
                                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    {index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 text-center font-bold">
                                            MAIN
                                        </div>
                                    )}
                                </div>
                            ))}
                            {uploadingImage && (
                                <div className="w-32 h-32 border border-dashed border-primary rounded-sm flex items-center justify-center animate-pulse">
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm cursor-pointer hover:bg-primary/90 transition-all shadow-sm"
                            >
                                <Plus size={18} />
                                Add Photos
                            </label>
                            <p className="text-xs text-foreground/50">Primary photo will be the first one.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Or use CSS Gradient (fallback)</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="e.g. bg-gradient-to-br from-blue-100 to-purple-100"
                                className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            />
                            <p className="text-xs text-foreground/60">Enter a Tailwind CSS background gradient class as fallback.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:col-span-2">
                    <input
                        type="checkbox"
                        name="inStock"
                        id="inStock"
                        checked={formData.inStock}
                        onChange={handleChange}
                        className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="inStock" className="text-sm font-medium text-foreground cursor-pointer">In Stock</label>
                </div>

                <div className="flex items-center gap-2 md:col-span-2">
                    <input
                        type="checkbox"
                        name="onSale"
                        id="onSale"
                        checked={formData.onSale || false}
                        onChange={handleChange}
                        className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="onSale" className="text-sm font-medium text-foreground cursor-pointer">On Sale</label>
                </div>

                <div className="flex items-center gap-2 md:col-span-2">
                    <input
                        type="checkbox"
                        name="isNew"
                        id="isNew"
                        checked={formData.isNew || false}
                        onChange={handleChange}
                        className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="isNew" className="text-sm font-medium text-foreground cursor-pointer">New Arrivals</label>
                </div>

                {formData.onSale && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Sale Price (₹)</label>
                        <input
                            type="number"
                            name="salePrice"
                            min="0"
                            step="1"
                            value={formData.salePrice || ''}
                            onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : undefined
                                setFormData(prev => ({ ...prev, salePrice: value }))
                            }}
                            className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-sm transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    )
}
