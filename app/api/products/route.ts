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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    await connectDB()
    
    // Generate ID from max ID in database
    const maxProduct = await Product.findOne().sort({ id: -1 }).lean()
    const newId = (maxProduct?.id || 0) + 1
    
    const product = new Product({
      ...body,
      id: newId,
      rating: body.rating || 0,
      reviews: body.reviews || 0,
    })
    
    await product.save()
    console.log('[API] Product saved to MongoDB:', product)
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

    await connectDB()
    
    let products = []
    
    if (query) {
      products = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      }).lean()
    } else if (category) {
      products = await Product.find({ category }).lean()
    } else {
      products = await Product.find({}).lean()
    }
    
    console.log('[API] Fetched products from MongoDB:', products.length)
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
