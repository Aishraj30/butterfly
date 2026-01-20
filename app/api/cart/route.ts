import { NextRequest, NextResponse } from 'next/server'
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart, CartItem, calculateCartTotal, getShippingCost, calculateTax } from '@/lib/db'
import { cookies } from 'next/headers'

async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    cookieStore.set('session_id', sessionId, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    })
  }

  return sessionId
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const items = getCart(sessionId)
    const subtotal = calculateCartTotal(items)
    const shipping = getShippingCost(subtotal)
    const tax = calculateTax(subtotal, 'CA')
    const total = subtotal + shipping + tax

    return NextResponse.json({
      success: true,
      data: {
        items,
        subtotal: Math.round(subtotal * 100) / 100,
        shipping,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
      },
    })
  } catch (error) {
    console.error('[API] Cart GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const body = await request.json()
    const { action, item, productId, size, color, quantity } = body

    let items

    if (action === 'add') {
      items = addToCart(sessionId, item as CartItem)
    } else if (action === 'remove') {
      items = removeFromCart(sessionId, productId, size, color)
    } else if (action === 'update') {
      items = updateCartItem(sessionId, productId, size, color, quantity)
    } else if (action === 'clear') {
      clearCart(sessionId)
      items = []
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }

    const subtotal = calculateCartTotal(items)
    const shipping = getShippingCost(subtotal)
    const tax = calculateTax(subtotal, 'CA')
    const total = subtotal + shipping + tax

    return NextResponse.json({
      success: true,
      data: {
        items,
        subtotal: Math.round(subtotal * 100) / 100,
        shipping,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
      },
    })
  } catch (error) {
    console.error('[API] Cart POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}
