'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, Filter, CheckCircle, XCircle, Clock, Package } from 'lucide-react'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const Loading = () => <div className="p-8 text-center text-foreground/60">Loading return requests...</div>

export default function AdminReturnsPage() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [returns, setReturns] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/returns')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setReturns(data.data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    const handleStatusUpdate = async (returnId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/returns/${returnId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setReturns(prev => prev.map(r => r._id === returnId ? { ...r, status: newStatus } : r));
                toast({
                    title: "Status Updated",
                    description: `Return request status updated to ${newStatus}`,
                })
            } else {
                toast({
                    title: "Update Failed",
                    description: data.error || "Unknown error occurred",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: "Error",
                description: "Failed to update return request status",
                variant: "destructive",
            })
        }
    };

    const filteredReturns = returns.filter((ret) =>
        ret.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ret.customerReason?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'approved': return 'bg-blue-100 text-blue-800'
            case 'received': return 'bg-purple-100 text-purple-800'
            case 'refunded': return 'bg-green-100 text-green-800'
            case 'rejected': return 'bg-red-100 text-red-800'
            case 'cancelled': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <Suspense fallback={<Loading />}>
            <main className="flex-1">
                <div className="bg-secondary border-b border-border sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="font-serif text-3xl font-bold text-primary">
                            Return Requests
                        </h1>
                        <p className="text-foreground/60 text-sm mt-1">
                            Manage and process customer return requests
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Toolbar */}
                    <div className="bg-background border border-border rounded-sm p-4 mb-6 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
                                <input
                                    type="text"
                                    placeholder="Search by Order ID or Reason..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-background border border-border rounded-sm overflow-hidden text-black">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Items</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reason</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/60">Loading...</td></tr>
                                    ) : filteredReturns.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/60">No return requests found.</td></tr>
                                    ) : (
                                        filteredReturns.map((ret) => (
                                            <tr key={ret._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-foreground">{ret.orderId}</td>
                                                <td className="px-6 py-4">
                                                    {ret.items.map((item: any, i: number) => (
                                                        <div key={i} className="text-sm">
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-gray-500 ml-1">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-foreground/60 max-w-xs truncate">
                                                    {ret.customerReason}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-foreground/60">
                                                    {new Date(ret.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${getStatusColor(ret.status)}`}>
                                                        {ret.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <select
                                                        value={ret.status}
                                                        onChange={(e) => handleStatusUpdate(ret._id, e.target.value)}
                                                        className="text-xs border border-border rounded-sm p-1 focus:ring-1 focus:ring-primary outline-none"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approve</option>
                                                        <option value="rejected">Reject</option>
                                                        <option value="received">Received</option>
                                                        <option value="refunded">Refunded</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
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
