import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Query must be at least 2 characters long'
      });
    }

    await connectDB();

    // Search products in database
    const searchQuery = query.toLowerCase().trim();
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { subCategory: { $regex: searchQuery, $options: 'i' } },
        { brand: { $regex: searchQuery, $options: 'i' } },
        { colors: { $in: [searchQuery] } }
      ]
    }).limit(8);

    // Transform MongoDB documents to match frontend interface
    const transformedProducts = products.map(product => ({
      ...product.toObject(),
      id: product._id.toString(), // Convert ObjectId to string and assign to id
      color: product.colors?.[0] || '', // Use first color for backward compatibility
      size: product.sizes || [], // Map sizes field
      reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
      imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
      image: product.imageGradient || '', // Map imageGradient to image
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    });
  }
}
