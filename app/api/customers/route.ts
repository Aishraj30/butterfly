import { NextResponse } from 'next/server'
import { getAllOrders } from '@/lib/db'

export async function GET() {
    try {
        const orders = getAllOrders()
        const customers = new Map()

        orders.forEach(order => {
            const email = order.customer?.email
            if (!email) return

            if (!customers.has(email)) {
                customers.set(email, {
                    id: email,
                    name: order.customer.name,
                    email: email,
                    orders: 0,
                    spent: 0,
                    lastOrder: order.createdAt
                })
            }

            const customer = customers.get(email)
            customer.orders += 1
            customer.spent += order.total || 0
            if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
                customer.lastOrder = order.createdAt
            }
        })

        return NextResponse.json({
            success: true,
            data: Array.from(customers.values())
        })
    } catch (error) {
        console.error('[API] Customers error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch customers' },
            { status: 500 }
        )
    }
}
