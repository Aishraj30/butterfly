import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/products'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const action = searchParams.get('action')
    const categories = searchParams.getAll('category')

    if (action === 'products' && categories.length > 0) {
      const allProducts = getAllProducts()
      const products = allProducts.filter((p) => categories.includes(p.category))
      
      return NextResponse.json({
        success: true,
        data: products,
        count: products.length,
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action or missing categories',
    })
  } catch (error) {
    console.error('[API] Collection products error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection products' },
      { status: 500 }
    )
  }
}
