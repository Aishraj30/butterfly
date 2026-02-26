import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order.js'
import User from '@/models/User.js'
import Product from '@/models/Product.js'
import Review from '@/models/Review.js'

export async function GET() {
    try {
        await connectDB()

        // Get current date and previous month for comparisons
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        // Get all orders
        const allOrders = await Order.find({}).sort({ createdAt: -1 })
        
        // Get current month orders
        const currentMonthOrders = allOrders.filter(order => 
            new Date(order.createdAt) >= currentMonthStart
        )
        
        // Get previous month orders
        const previousMonthOrders = allOrders.filter(order => 
            new Date(order.createdAt) >= previousMonthStart && 
            new Date(order.createdAt) <= previousMonthEnd
        )

        // Calculate metrics
        const totalCustomers = await User.countDocuments({ role: 'user' })
        const totalOrders = allOrders.length
        const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0)

        // Calculate percentage changes
        const revenueChange = previousMonthRevenue > 0 
            ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
            : 0
        const ordersChange = previousMonthOrders.length > 0
            ? ((currentMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length * 100).toFixed(1)
            : 0
        const customersChange = 8.3 // Placeholder - would need historical data

        // Get top products by analyzing order items
        const productSales = new Map()
        
        allOrders.forEach(order => {
            order.items?.forEach(item => {
                const productId = item.productId?.toString()
                if (productId) {
                    if (!productSales.has(productId)) {
                        productSales.set(productId, {
                            name: item.name || 'Unknown Product',
                            sold: 0,
                            revenue: 0,
                            rating: 0,
                            reviews: 0
                        })
                    }
                    const sales = productSales.get(productId)
                    sales.sold += item.quantity || 1
                    sales.revenue += (item.price || 0) * (item.quantity || 1)
                }
            })
        })

        // Get product ratings
        const products = await Product.find({ isActive: true }).limit(10)
        const productRatings = new Map()
        
        products.forEach(product => {
            productRatings.set(product._id.toString(), {
                rating: product.rating || 0,
                reviews: product.reviewsCount || 0
            })
        })

        // Combine sales data with product data
        const topProducts = Array.from(productSales.entries())
            .map(([productId, sales]) => {
                const ratingData = productRatings.get(productId) || { rating: 0, reviews: 0 }
                return {
                    id: productId,
                    name: sales.name,
                    sold: sales.sold,
                    profit: `₹${(sales.revenue / 1000).toFixed(1)}K`,
                    review: ratingData.rating
                }
            })
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)

        // Get customer statistics
        const totalGenderCustomers = totalCustomers
        const activeCustomers = await User.countDocuments({ role: 'user', isActive: true })
        const inactiveCustomers = totalCustomers - activeCustomers

        const customerData = totalGenderCustomers > 0 ? [
            { 
                name: 'Active', 
                value: activeCustomers, 
                percentage: ((activeCustomers / totalGenderCustomers) * 100).toFixed(1) 
            },
            { 
                name: 'Inactive', 
                value: inactiveCustomers, 
                percentage: ((inactiveCustomers / totalGenderCustomers) * 100).toFixed(1) 
            }
        ] : [
            { name: 'Active', value: 0, percentage: 0 },
            { name: 'Inactive', value: 0, percentage: 0 }
        ]

        // Get recent orders
        const recentOrders = allOrders
            .slice(0, 5)
            .map(order => ({
                id: order.orderId || order._id.toString(),
                customer: order.customer?.name || 'Guest',
                amount: `₹${(order.total || 0).toLocaleString()}`,
                status: order.status || 'Pending',
                date: order.createdAt
            }))

        // Get sales data for chart (last 6 months)
        const salesData = []
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
            
            const monthOrders = allOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate >= monthStart && orderDate < monthEnd
            })
            
            const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
            
            salesData.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                revenue: monthRevenue,
                orders: monthOrders.length
            })
        }

        // Get geographic distribution from order addresses
        const regionDistribution = new Map()
        
        allOrders.forEach(order => {
            if (order.shipping?.country) {
                const country = order.shipping.country.toLowerCase()
                let region = 'Others'
                
                // Categorize countries into regions
                if (['china', 'japan', 'india', 'singapore', 'malaysia', 'thailand', 'indonesia', 'philippines', 'vietnam', 'south korea', 'hong kong', 'taiwan'].includes(country)) {
                    region = 'Asia'
                } else if (['united states', 'canada', 'mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru'].includes(country)) {
                    region = 'America'
                } else if (['united kingdom', 'germany', 'france', 'italy', 'spain', 'netherlands', 'belgium', 'sweden', 'norway', 'denmark', 'finland', 'poland', 'austria', 'switzerland'].includes(country)) {
                    region = 'Europe'
                }
                
                regionDistribution.set(region, (regionDistribution.get(region) || 0) + 1)
            }
        })

        const totalOrdersWithLocation = Array.from(regionDistribution.values()).reduce((sum, count) => sum + count, 0)
        
        const distributionData = totalOrdersWithLocation > 0 ? [
            { 
                name: 'Asia', 
                percentage: ((regionDistribution.get('Asia') || 0) / totalOrdersWithLocation * 100).toFixed(1),
                color: 'bg-black'
            },
            { 
                name: 'America', 
                percentage: ((regionDistribution.get('America') || 0) / totalOrdersWithLocation * 100).toFixed(1),
                color: 'bg-gray-600'
            },
            { 
                name: 'Europe', 
                percentage: ((regionDistribution.get('Europe') || 0) / totalOrdersWithLocation * 100).toFixed(1),
                color: 'bg-gray-400'
            },
            { 
                name: 'Others', 
                percentage: ((regionDistribution.get('Others') || 0) / totalOrdersWithLocation * 100).toFixed(1),
                color: 'bg-gray-300'
            }
        ] : [
            { name: 'Asia', percentage: '0.0', color: 'bg-black' },
            { name: 'America', percentage: '0.0', color: 'bg-gray-600' },
            { name: 'Europe', percentage: '0.0', color: 'bg-gray-400' },
            { name: 'Others', percentage: '0.0', color: 'bg-gray-300' }
        ]

        return NextResponse.json({
            success: true,
            data: {
                metrics: [
                    {
                        title: 'Customers',
                        value: totalCustomers.toLocaleString(),
                        change: parseFloat(customersChange),
                        changeText: 'vs. previous month',
                        icon: 'users',
                        color: 'bg-gray-100 dark:bg-gray-800'
                    },
                    {
                        title: 'Total Sales',
                        value: `₹${totalRevenue.toLocaleString()}`,
                        change: parseFloat(revenueChange),
                        changeText: 'vs. previous month',
                        icon: 'dollar',
                        color: 'bg-gray-100 dark:bg-gray-800'
                    },
                    {
                        title: 'Total Orders',
                        value: totalOrders.toLocaleString(),
                        change: parseFloat(ordersChange),
                        changeText: 'vs. previous month',
                        icon: 'cart',
                        color: 'bg-gray-100 dark:bg-gray-800'
                    }
                ],
                topProducts,
                customerData,
                recentOrders,
                salesData,
                distributionData
            }
        })

    } catch (error) {
        console.error('[API] Dashboard Stats error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        )
    }
}
