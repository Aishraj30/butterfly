import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrdersByEmail, createContactSubmission } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, subtotal, shipping, tax, total, customer, shipping: shippingAddress, billing: billingAddress } = body

    // Validate required fields
    if (!items?.length || !customer?.email || !shippingAddress?.address || !billingAddress?.address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const order = createOrder({
      items,
      total: Math.round(total * 100) / 100,
      customer,
      shipping: shippingAddress,
      billing: billingAddress,
      status: 'pending',
    })

    // Create order confirmation email notification
    await createContactSubmission({
      name: customer.name,
      email: customer.email,
      subject: `Order Confirmation: ${order.id}`,
      message: `Your order has been received. Order ID: ${order.id}. Total: $${order.total.toFixed(2)}`,
    })

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully. Please check your email for confirmation.',
    })
  } catch (error) {
    console.error('[API] Orders POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter required' },
        { status: 400 }
      )
    }

    const orders = getOrdersByEmail(email)

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    })
  } catch (error) {
    console.error('[API] Orders GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
