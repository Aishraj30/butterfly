import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import mongoose from 'mongoose'

// Define a simple Product schema for MongoDB
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  category: String,
  brand: String,
  color: String,
  gender: String,
  size: [String],
  rating: Number,
  reviews: Number,
  image: String,
  imageUrl: String,
  inStock: Boolean,
  onSale: Boolean,
  salePrice: Number,
  isNew: Boolean,
  createdAt: { type: Date, default: Date.now }
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    // Handle both Promise and non-Promise params (for different Next.js versions)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams
    
    const body = await request.json()
    
    await connectDB()
    const product = await Product.findOneAndUpdate(
      { id: parseInt(id) },
      body,
      { new: true }
    )
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('[API] Update product error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    // Handle both Promise and non-Promise params (for different Next.js versions)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams
    
    await connectDB()
    const result = await Product.findOneAndDelete({ id: parseInt(id) })
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Delete product error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    // Handle both Promise and non-Promise params (for different Next.js versions)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams
    
    console.log('[API] Fetching product with id:', id)
    
    await connectDB()
    const product = await Product.findOne({ id: parseInt(id) }).lean()
    
    console.log('[API] Found product:', product)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('[API] Product detail error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
