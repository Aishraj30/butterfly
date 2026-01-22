import { NextRequest, NextResponse } from 'next/server'
import { getAllBrands, addBrand } from '@/lib/brands'

export async function GET(request: NextRequest) {
  try {
    const brands = getAllBrands()
    return NextResponse.json({
      success: true,
      data: brands,
      count: brands.length,
    })
  } catch (error) {
    console.error('[API] Brands error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const brand = addBrand(body)
    return NextResponse.json({ success: true, data: brand })
  } catch (error) {
    console.error('[API] Create brand error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}

