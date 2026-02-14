import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Collection from "@/models/Collection";
import { verifyToken } from "@/lib/jwt";

// 🔒 helper: admin check
const isAdmin = (req) => {
    try {
        const auth = req.headers.get("authorization");
        if (!auth || auth === "Bearer null") return null;
        const token = auth.split(" ")[1];
        return verifyToken(token);
    } catch (e) {
        return null;
    }
};

export async function POST(req) {
    try {
        await connectDB();

        // Check admin authorization
        const user = isAdmin(req);
        // if (!user || user.role !== "admin") {
        //   return NextResponse.json(
        //     { message: "Admin access only" },
        //     { status: 403 }
        //   );
        // }

        const body = await req.json();
        const { products } = body;

        if (!Array.isArray(products) || products.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid products array" },
                { status: 400 }
            );
        }

        // Process products to ensure consistency
        const productsToCreate = products.map(p => ({
            ...p,
            images: Array.isArray(p.images) ? p.images : (p.imageUrl ? [p.imageUrl] : []),
            sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L'],
            isActive: p.isActive !== undefined ? p.isActive : true,
            inStock: p.inStock !== undefined ? p.inStock : true,
        }));

        const createdProducts = await Product.insertMany(productsToCreate);

        // Group products by category to optimize updates
        const categoryMap = {};
        createdProducts.forEach(p => {
            if (p.category) {
                if (!categoryMap[p.category]) categoryMap[p.category] = [];
                categoryMap[p.category].push(p._id);
            }
        });

        // Update collections
        await Promise.all(
            Object.entries(categoryMap).map(([categoryName, pIds]) =>
                Collection.findOneAndUpdate(
                    { name: categoryName },
                    { $addToSet: { products: { $each: pIds } } }
                )
            )
        );

        return NextResponse.json(
            {
                success: true,
                message: `${createdProducts.length} products created successfully`,
                data: createdProducts
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('[API Products Bulk] POST error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
