'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Save, ArrowLeft, Loader2, Upload, ImageIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { compressImage, isValidImageFile } from '@/lib/imageCompression'

interface BulkProduct {
    tempId: string
    name: string
    brand: string
    price: number
    category: string
    subCategory: string
    gender: string
    color: string
    sizes: string[]
    imageUrl: string
}

export default function BulkProductAddPage() {
    const router = useRouter()
    const { token } = useAuth()
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadingRows, setUploadingRows] = useState<string[]>([])

    // Data for dropdowns
    const [collections, setCollections] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [brands, setBrands] = useState<any[]>([])

    const [products, setProducts] = useState<BulkProduct[]>([
        {
            tempId: Math.random().toString(36).substr(2, 9),
            name: '',
            brand: '',
            price: 0,
            category: '',
            subCategory: '',
            gender: 'Unisex',
            color: '',
            sizes: ['S', 'M', 'L'],
            imageUrl: ''
        }
    ])

    useEffect(() => {
        setLoading(true)
        Promise.all([
            fetch('/api/collections').then(res => res.json()),
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/brands').then(res => res.json())
        ]).then(([collectionsData, categoriesData, brandsData]) => {
            if (collectionsData.success) setCollections(collectionsData.collections || collectionsData.data || [])
            if (categoriesData.success) setCategories(categoriesData.data || [])
            if (brandsData.success) setBrands(brandsData.data || [])
        }).catch(error => {
            console.error('Error fetching dropdown data:', error)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const addRow = () => {
        setProducts([
            ...products,
            {
                tempId: Math.random().toString(36).substr(2, 9),
                name: '',
                brand: '',
                price: 0,
                category: '',
                subCategory: '',
                gender: 'Unisex',
                color: '',
                sizes: ['S', 'M', 'L'],
                imageUrl: ''
            }
        ])
    }

    const removeRow = (tempId: string) => {
        if (products.length === 1) return
        setProducts(products.filter(p => p.tempId !== tempId))
    }

    const updateProduct = (tempId: string, field: keyof BulkProduct, value: any) => {
        setProducts(products.map(p =>
            p.tempId === tempId ? { ...p, [field]: value } : p
        ))
    }

    const handleRowImageUpload = async (tempId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!isValidImageFile(file)) {
            alert('Please select a valid image file')
            return
        }

        setUploadingRows(prev => [...prev, tempId])

        try {
            const compressedFile = await compressImage(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                quality: 0.8,
                useWebWorker: true
            })

            const formData = new FormData()
            formData.append('file', compressedFile)

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                updateProduct(tempId, 'imageUrl', data.url)
            } else {
                alert(data.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Error uploading row image:', error)
            alert('Failed to upload image')
        } finally {
            setUploadingRows(prev => prev.filter(id => id !== tempId))
        }
    }

    const handleBulkSubmit = async () => {
        // Validation
        const invalidProducts = products.filter(p => !p.name || !p.category || !p.price)
        if (invalidProducts.length > 0) {
            alert('Please fill at least Name, Category, and Price for all rows')
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ products })
            })

            const data = await response.json()
            if (data.success) {
                alert(`Successfully added ${products.length} products`)
                router.push('/admin/products')
            } else {
                alert(data.message || 'Failed to add products')
            }
        } catch (error) {
            console.error('Bulk submission error:', error)
            alert('An error occurred during bulk submission')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/products"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-gray-900">Bulk Product Upload</h1>
                                <p className="text-sm text-gray-500">Add multiple products quickly using the table below</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={addRow}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <Plus size={18} />
                                Add Row
                            </button>
                            <button
                                onClick={handleBulkSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save All Products
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="p-6">
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 w-10">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 min-w-[200px]">Product Name*</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 min-w-[150px]">Brand</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 min-w-[120px]">Price (₹)*</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 min-w-[150px]">Collection*</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 min-w-[150px]">Style</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 min-w-[100px]">Gender</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 min-w-[100px]">Color</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 min-w-[200px]">Product Image</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-gray-500 w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.tempId} className="border-b border-gray-100 hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-sm text-gray-400 font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                value={product.name}
                                                onChange={(e) => updateProduct(product.tempId, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-transparent focus:border-gray-300 focus:bg-white bg-transparent rounded-sm text-sm"
                                                placeholder="e.g. Silk Gown"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <select
                                                value={product.brand}
                                                onChange={(e) => updateProduct(product.tempId, 'brand', e.target.value)}
                                                className="w-full px-3 py-2 border border-transparent focus:border-gray-300 focus:bg-white bg-transparent rounded-sm text-sm"
                                            >
                                                <option value="">Select Brand</option>
                                                {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="number"
                                                value={product.price || ''}
                                                onChange={(e) => updateProduct(product.tempId, 'price', parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-transparent focus:border-gray-300 focus:bg-white bg-transparent rounded-sm text-sm"
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <select
                                                value={product.category}
                                                onChange={(e) => updateProduct(product.tempId, 'category', e.target.value)}
                                                className="w-full px-3 py-2 border border-transparent focus:border-gray-300 focus:bg-white bg-transparent rounded-sm text-sm"
                                            >
                                                <option value="">Select Collection</option>
                                                {collections.map(c => <option key={c.id || c._id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-2 py-2">
                                            <select
                                                value={product.subCategory}
                                                onChange={(e) => updateProduct(product.tempId, 'subCategory', e.target.value)}
                                                className="w-full px-3 py-2 border border-transparent focus:border-gray-300 focus:bg-white bg-transparent rounded-sm text-sm"
                                            >
                                                <option value="">Select Style</option>
                                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-2 py-2">
                                            <select
                                                value={product.gender}
                                                onChange={(e) => updateProduct(product.tempId, 'gender', e.target.value)}
                                                className="w-full px-3 py-2 border border-transparent focus:border-gray-300 focus:bg-white bg-transparent rounded-sm text-sm"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Unisex">Unisex</option>
                                            </select>
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                value={product.color}
                                                onChange={(e) => updateProduct(product.tempId, 'color', e.target.value)}
                                                className="w-full px-3 py-2 border border-transparent focus:border-gray-300 focus:bg-white bg-transparent rounded-sm text-sm"
                                                placeholder="Color"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded-sm border border-gray-200 overflow-hidden">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ImageIcon size={16} />
                                                        </div>
                                                    )}
                                                    {uploadingRows.includes(product.tempId) && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`file-${product.tempId}`}
                                                        className="hidden"
                                                        onChange={(e) => handleRowImageUpload(product.tempId, e)}
                                                    />
                                                    <label
                                                        htmlFor={`file-${product.tempId}`}
                                                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[10px] font-bold uppercase tracking-tight rounded-sm cursor-pointer transition-colors"
                                                    >
                                                        <Upload size={12} />
                                                        {product.imageUrl ? 'Change' : 'Upload'}
                                                    </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => removeRow(product.tempId)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                                disabled={products.length === 1}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium italic">* Indicates required fields</span>
                        <button
                            onClick={addRow}
                            className="flex items-center gap-2 text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 rounded-sm transition-all"
                        >
                            <Plus size={16} />
                            Add another product row
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky Actions Bar at Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 flex justify-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button
                    onClick={handleBulkSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-3 px-12 py-3 bg-black text-white rounded-sm text-base font-bold hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Uploading Products...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            SAVE ALL {products.length} PRODUCTS
                        </>
                    )}
                </button>
            </div>
            <div className="h-24"></div> {/* Spacer for sticky bar */}
        </div>
    )
}
