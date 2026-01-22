import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory, searchProducts, addProduct } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = addProduct(body)
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('[API] Create product error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const query = searchParams.get('q')

    let products

    if (query) {
      products = searchProducts(query)
    } else if (category) {
      products = getProductsByCategory(category)
    } else {
      products = getAllProducts()
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (error) {
    console.error('[API] Products error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
