import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Category from '@/models/Category'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const categories = await Category.find({ isActive: true }).sort({ name: 1 })

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
    await connectDB()
    const body = await request.json()

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${body.name}$`, 'i') } })

    if (existingCategory) {
      // If allowed to update, maybe add subcategories here?
      // For now, let's just return the existing one or validation error
      return NextResponse.json(
        { success: true, data: existingCategory, message: 'Category already exists' },
        { status: 200 }
      )
    }

    const category = await Category.create(body)

    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error: any) {
    console.error('[API] Create category error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}

