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

        // Get the current product to find its metadata
        const currentProduct = await Product.findById(productId);

        if (!currentProduct) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Tiered recommendation logic
        let query: any = {
            _id: { $ne: productId },
            isActive: true
        };

        // Tier 1: Primary match (Category + Gender + In Stock)
        const primaryQuery = { ...query, inStock: true };
        if (currentProduct.category) primaryQuery.category = currentProduct.category;
        if (currentProduct.gender) primaryQuery.gender = currentProduct.gender;

        let recommendedProducts = await Product.find(primaryQuery)
            .sort({ rating: -1, createdAt: -1 })
            .limit(4)
            .lean();

        // Tier 2: Same Category + In Stock
        if (recommendedProducts.length < 4 && currentProduct.category) {
            const secondaryQuery = {
                ...query,
                inStock: true,
                category: currentProduct.category,
                _id: { $ne: productId, $nin: recommendedProducts.map(p => p._id.toString()) }
            };
            const tier2 = await Product.find(secondaryQuery)
                .sort({ rating: -1, createdAt: -1 })
                .limit(4 - recommendedProducts.length)
                .lean();
            recommendedProducts = [...recommendedProducts, ...tier2];
        }

        // Tier 3: Same Collection + In Stock
        if (recommendedProducts.length < 4 && currentProduct.collectionName) {
            const collectionQuery = {
                ...query,
                inStock: true,
                collectionName: currentProduct.collectionName,
                _id: { $ne: productId, $nin: recommendedProducts.map(p => p._id.toString()) }
            };
            const tier3 = await Product.find(collectionQuery)
                .sort({ rating: -1, createdAt: -1 })
                .limit(4 - recommendedProducts.length)
                .lean();
            recommendedProducts = [...recommendedProducts, ...tier3];
        }

        // Tier 4: Global In Stock
        if (recommendedProducts.length < 4) {
            const globalQuery = {
                ...query,
                inStock: true,
                _id: { $ne: productId, $nin: recommendedProducts.map(p => p._id.toString()) }
            };
            const tier4 = await Product.find(globalQuery)
                .sort({ rating: -1, createdAt: -1 })
                .limit(4 - recommendedProducts.length)
                .lean();
            recommendedProducts = [...recommendedProducts, ...tier4];
        }

        // Final Tier: Even if out of stock, just show something active
        if (recommendedProducts.length < 4) {
            const lastResortQuery = {
                ...query,
                _id: { $ne: productId, $nin: recommendedProducts.map(p => p._id.toString()) }
            };
            const tier5 = await Product.find(lastResortQuery)
                .sort({ rating: -1, createdAt: -1 })
                .limit(4 - recommendedProducts.length)
                .lean();
            recommendedProducts = [...recommendedProducts, ...tier5];
        }

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
