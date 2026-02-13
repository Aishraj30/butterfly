import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db.js';
import Product from '@/models/Product.js';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        
        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Get the current product to find its category
        const currentProduct = await Product.findById(productId);
        
        if (!currentProduct) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Find recommended products based on:
        // 1. Same category (excluding current product)
        // 2. Same gender if available
        // 3. Limit to 4 products
        // 4. Sort by rating or newest first
        
        const query: any = {
            _id: { $ne: productId },
            isActive: true,
            inStock: true
        };

        // Add category filter
        if (currentProduct.category) {
            query.category = currentProduct.category;
        }

        // Add gender filter if available
        if (currentProduct.gender) {
            query.gender = currentProduct.gender;
        }

        const recommendedProducts = await Product.find(query)
            .sort({ rating: -1, createdAt: -1 })
            .limit(4)
            .lean();

        return NextResponse.json({
            success: true,
            data: recommendedProducts.map(product => ({
                ...product,
                id: product._id.toString(),
                _id: product._id.toString()
            }))
        });

    } catch (error) {
        console.error('Error fetching recommended products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch recommended products' },
            { status: 500 }
        );
    }
}
