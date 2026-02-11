'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, Filter, Eye } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'

const Loading = () => <div className="p-8 text-center text-foreground/60">Loading orders...</div>

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Fetch all orders (no email param)
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(data.data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    const filteredOrders = orders.filter((order) =>
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Suspense fallback={<Loading />}>
            <main className="flex-1">
                <div className="bg-secondary border-b border-border sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
                        <h1 className="font-serif text-3xl font-bold text-primary">
                            Orders
                        </h1>
                        <p className="text-foreground/60 text-sm mt-1">
                            Manage and track customer orders
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
                    {/* Toolbar */}
                    <div className="bg-background border border-border rounded-sm p-4 mb-6 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
                                <input
                                    type="text"
                                    placeholder="Search by Order ID, Name, or Email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors">
                                <Filter size={18} />
                                Filter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm hover:bg-secondary transition-colors">
                                Sort By
                                <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-background border border-border rounded-sm overflow-hidden text-black">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/60">Loading orders...</td></tr>
                                    ) : filteredOrders.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/60">No orders found.</td></tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-foreground">{order.customer?.name}</p>
                                                    <p className="text-xs text-foreground/60">{order.customer?.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-foreground/60">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-foreground">
                                                    ${order.total?.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 uppercase">
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-primary hover:bg-secondary rounded-sm transition-colors" title="View Details">
                                                        <Eye size={18} />
                                                    </button>
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
        </Suspense>
    )
}
