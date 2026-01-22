'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ProductForm } from '@/components/admin/ProductForm'
import { useEffect, useState, use } from 'react'
import { Product } from '@/lib/products'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProduct(data.data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div>Loading...</div>
    if (!product) return <div>Product not found</div>

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />

            <main className="flex-1 lg:ml-0">
                <div className="bg-secondary border-b border-border sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
                        <h1 className="font-serif text-3xl font-bold text-primary">
                            Edit Product
                        </h1>
                        <p className="text-foreground/60 text-sm mt-1">
                            Update existing product details
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
                    <ProductForm initialData={product} isEdit />
                </div>
            </main>
        </div>
    )
}
