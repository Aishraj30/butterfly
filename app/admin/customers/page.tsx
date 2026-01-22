'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useState, useEffect } from 'react'
import { Search, ChevronDown, Filter, Mail } from 'lucide-react'
import { Suspense } from 'react'

const Loading = () => <div className="p-8 text-center text-foreground/60">Loading customers...</div>

export default function AdminCustomersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [customers, setCustomers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/customers')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCustomers(data.data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex min-h-screen bg-background">
                <AdminSidebar />

                <main className="flex-1 lg:ml-0">
                    <div className="bg-secondary border-b border-border sticky top-0 z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
                            <h1 className="font-serif text-3xl font-bold text-primary">
                                Customers
                            </h1>
                            <p className="text-foreground/60 text-sm mt-1">
                                View and manage your customer base
                            </p>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
                        <div className="bg-background border border-border rounded-sm p-4 mb-6 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
                                    <input
                                        type="text"
                                        placeholder="Search customers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors">
                                    <Filter size={18} />
                                    Filter
                                </button>
                            </div>
                        </div>

                        <div className="bg-background border border-border rounded-sm overflow-hidden text-black">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-secondary border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Orders</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Spent</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Order</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/60">Loading customers...</td></tr>
                                        ) : filteredCustomers.length === 0 ? (
                                            <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/60">No customers found.</td></tr>
                                        ) : (
                                            filteredCustomers.map((customer) => (
                                                <tr key={customer.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-foreground">{customer.name}</td>
                                                    <td className="px-6 py-4 text-sm text-foreground/60">{customer.email}</td>
                                                    <td className="px-6 py-4">{customer.orders}</td>
                                                    <td className="px-6 py-4 font-semibold text-foreground">${customer.spent.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-sm text-foreground/60">
                                                        {new Date(customer.lastOrder).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <a href={`mailto:${customer.email}`} className="p-2 text-primary hover:bg-secondary rounded-sm transition-colors inline-block" title="Email Customer">
                                                            <Mail size={18} />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </Suspense>
    )
}
