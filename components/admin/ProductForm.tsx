'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products'
import { Category } from '@/lib/categories'
import { Brand } from '@/lib/brands'

interface ProductFormProps {
    initialData?: Product
    isEdit?: boolean
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [formData, setFormData] = useState<Partial<Product>>(
        initialData || {
            name: '',
            price: 0,
            category: '',
            brand: '',
            color: '',
            inStock: true,
            image: '', // Will store image URL
            imageUrl: '', // Additional field for uploaded images
            size: ['S', 'M', 'L'], // Default sizes
        }
    )
    const [uploadingImage, setUploadingImage] = useState(false)
    const [imagePreview, setImagePreview] = useState('')

    useEffect(() => {
        // Fetch categories and brands
        Promise.all([
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/brands').then(res => res.json())
        ]).then(([categoriesData, brandsData]) => {
            if (categoriesData.success) {
                setCategories(categoriesData.data)
            }
            if (brandsData.success) {
                setBrands(brandsData.data)
            }
        }).catch(error => {
            console.error('Error fetching categories/brands:', error)
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        
        try {
            const formData = new FormData()
            formData.append('file', file)
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            
            const data = await response.json()
            
            if (data.success) {
                setFormData(prev => ({ 
                    ...prev, 
                    image: data.url,
                    imageUrl: data.url 
                }))
                setImagePreview(data.url)
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
        setLoading(true)

        try {
            const url = isEdit ? `/api/products/${initialData?.id}` : '/api/products'
            const method = isEdit ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-background p-6 rounded-sm border border-border">
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
                    <label className="text-sm font-medium text-foreground">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
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
                    <label className="text-sm font-medium text-foreground">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        name="sizes"
                        value={Array.isArray(formData.size) ? formData.size.join(', ') : formData.size || ''}
                        onChange={(e) => {
                            const sizes = e.target.value.split(',').map(s => s.trim()).filter(s => s)
                            setFormData(prev => ({ ...prev, size: sizes }))
                        }}
                        placeholder="e.g. XS, S, M, L, XL"
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                    <p className="text-xs text-foreground/60">Enter sizes separated by commas (e.g., XS, S, M, L, XL)</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Product Image</label>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {uploadingImage ? 'Uploading...' : 'Choose Image'}
                            </label>
                            {(imagePreview || formData.imageUrl) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, image: '', imageUrl: '' }))
                                        setImagePreview('')
                                    }}
                                    className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                                >
                                    Remove Image
                                </button>
                            )}
                        </div>
                        
                        {(imagePreview || formData.imageUrl) && (
                            <div className="mt-4">
                                <img 
                                    src={imagePreview || formData.imageUrl} 
                                    alt="Product preview" 
                                    className="w-32 h-32 object-cover rounded-sm border border-border"
                                />
                            </div>
                        )}
                        
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

                {formData.onSale && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Sale Price ($)</label>
                        <input
                            type="number"
                            name="salePrice"
                            min="0"
                            step="0.01"
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
