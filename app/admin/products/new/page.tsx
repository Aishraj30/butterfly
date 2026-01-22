'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />

            <main className="flex-1 lg:ml-0">
                <div className="bg-secondary border-b border-border sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
                        <h1 className="font-serif text-3xl font-bold text-primary">
                            Add New Product
                        </h1>
                        <p className="text-foreground/60 text-sm mt-1">
                            Create a new item in your inventory
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
                    <ProductForm />
                </div>
            </main>
        </div>
    )
}
