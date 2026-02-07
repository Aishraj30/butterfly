import { NextRequest, NextResponse } from 'next/server';

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

    // Fetch products from your database or API
    // This is a placeholder - replace with your actual product fetching logic
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch products'
      });
    }

    // Filter products based on search query
    const searchQuery = query.toLowerCase().trim();
    const filteredProducts = data.products.filter((product: any) => 
      product.name.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery) ||
      product.brand?.toLowerCase().includes(searchQuery) ||
      product.color?.toLowerCase().includes(searchQuery)
    ).slice(0, 8); // Limit to 8 suggestions

    return NextResponse.json({
      success: true,
      products: filteredProducts
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    });
  }
}
