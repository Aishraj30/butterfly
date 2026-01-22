import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories, addCategory } from '@/lib/categories'

export async function GET(request: NextRequest) {
  try {
    const categories = getAllCategories()
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    })
  } catch (error) {
    console.error('[API] Categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const category = addCategory(body)
    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('[API] Create category error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

