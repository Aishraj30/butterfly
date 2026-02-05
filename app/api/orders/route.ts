import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Contact from '@/models/Contact'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { items, total, customer, shipping: shippingAddress, billing: billingAddress } = body

    // Validate required fields
    if (!items?.length || !customer?.email || !shippingAddress?.address || !billingAddress?.address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const order = await Order.create({
      items,
      total: Math.round(total * 100) / 100,
      customer,
      shipping: shippingAddress,
      billing: billingAddress,
      status: 'pending',
    })

    // Create order confirmation email notification (saving to database as contact submission)
    await Contact.create({
      name: customer.name,
      email: customer.email,
      subject: `Order Confirmation: ${order.orderId}`,
      message: `Your order has been received. Order ID: ${order.orderId}. Total: ₹${order.total.toLocaleString()}`,
    })

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully. Please check your email for confirmation.',
    })
  } catch (error: any) {
    console.error('[API] Orders POST error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const email = request.nextUrl.searchParams.get('email')
    const orders = email ? await Order.find({ 'customer.email': email }).sort({ createdAt: -1 }) : await Order.find({}).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    })
  } catch (error: any) {
    console.error('[API] Orders GET error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
