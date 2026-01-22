'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products'

interface ProductFormProps {
    initialData?: Product
    isEdit?: boolean
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Product>>(
        initialData || {
            name: '',
            price: 0,
            category: '',
            color: '',
            inStock: true,
            image: 'bg-gradient-to-br from-gray-100 to-gray-200', // Default placeholder
            size: ['S', 'M', 'L'], // Default sizes
        }
    )

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
                        <option value="Evening Wear">Evening Wear</option>
                        <option value="Cocktail">Cocktail</option>
                        <option value="Jacket">Jacket</option>
                        <option value="Blazer">Blazer</option>
                        <option value="Blouse">Blouse</option>
                        <option value="Coat">Coat</option>
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
                    <label className="text-sm font-medium text-foreground">Image Class (Tailwind Gradient)</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="e.g. bg-gradient-to-br from-blue-100 to-purple-100"
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                    <p className="text-xs text-foreground/60">Enter a Tailwind CSS background gradient class.</p>
                </div>

                <div className="flex items-center gap-2">
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
