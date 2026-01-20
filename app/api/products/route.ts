import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory, searchProducts } from '@/lib/db'

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
