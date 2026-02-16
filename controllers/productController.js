import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Collection from "@/models/Collection";
import Category from "@/models/Category";
import Inventory from "@/models/inventory";
import { verifyToken } from "@/lib/jwt";

// Helper: admin check
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

export class ProductController {

    // GET ALL PRODUCTS
    static async getAll(req) {
        try {
            await connectDB();

            const user = isAdmin(req);
            const filter = user && user.role === "admin" ? {} : { isActive: true };

            const products = await Product.find(filter);
            const allInventory = await Inventory.find({});

            // Transform MongoDB documents to match frontend interface
            const transformedProducts = products.map(product => {
                const productInventory = allInventory.filter(inv => inv.productId.toString() === product._id.toString());
                const hasInventory = productInventory.length > 0;
                const totalAvailableStock = productInventory.reduce((sum, inv) => sum + ((inv.totalStock || 0) - (inv.reservedStock || 0)), 0);
                const isActuallyInStock = hasInventory && totalAvailableStock > 0;

                return {
                    ...product.toObject(),
                    id: product._id.toString(), // Convert ObjectId to string and assign to id
                    color: product.colors?.[0] || '', // Use first color for backward compatibility
                    size: product.sizes || [], // Map sizes field
                    reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
                    imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
                    image: product.imageGradient || '', // Map imageGradient to image
                    inStock: isActuallyInStock // Override with real inventory status
                };
            });

            return NextResponse.json({ success: true, products: transformedProducts });
        } catch (error) {
            console.error('[API Products] GET error:', error);
            return NextResponse.json({
                success: false,
                message: error.message || "Failed to fetch products"
            }, { status: 500 });
        }
    }

    // CREATE PRODUCT (ADMIN)
    static async create(req) {
        try {
            await connectDB();

            // const user = isAdmin(req);
            // if (!user || user.role !== "admin") {
            //   return NextResponse.json(
            //     { message: "Admin access only" },
            //     { status: 403 }
            //   );
            // }

            const body = await req.json();
            const product = await Product.create(body);

            // Link product to collection if collectionName is provided
            if (body.collectionName) {
                await Collection.findOneAndUpdate(
                    { name: body.collectionName },
                    { $addToSet: { products: product._id } }
                );
            }

            // Update Category and SubCategory
            if (body.category) {
                const update = { $setOnInsert: { name: body.category, isActive: true } };
                if (body.subCategory) {
                    update.$addToSet = { subCategories: body.subCategory };
                }
                await Category.findOneAndUpdate(
                    { name: body.category },
                    update,
                    { upsert: true, new: true }
                );
            }

            // Transform MongoDB document to match frontend interface
            const transformedProduct = {
                ...product.toObject(),
                id: product._id.toString(), // Convert ObjectId to string and assign to id
                color: product.colors?.[0] || '', // Use first color for backward compatibility
                size: product.sizes || [], // Map sizes field
                reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
                imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
                image: product.imageGradient || '', // Map imageGradient to image
            };

            return NextResponse.json(
                { success: true, data: transformedProduct },
                { status: 201 }
            );
        } catch (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }
    }

    // GET PRODUCT BY ID
    static async getById(req, { params }) {
        await connectDB();
        const { id } = await params;

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // Check inventory status
        const inventoryItems = await Inventory.find({ productId: id });
        const hasInventory = inventoryItems.length > 0;
        const totalAvailableStock = inventoryItems.reduce((sum, item) => sum + ((item.totalStock || 0) - (item.reservedStock || 0)), 0);

        // A product is in stock ONLY if it has an inventory record AND available stock > 0
        const isActuallyInStock = hasInventory && totalAvailableStock > 0;

        // Transform MongoDB document to match frontend interface
        const transformedProduct = {
            ...product.toObject(),
            id: product._id.toString(), // Convert ObjectId to string and assign to id
            color: product.colors?.[0] || '', // Use first color for backward compatibility
            size: product.sizes || [], // Map sizes field
            reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
            imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
            image: product.imageGradient || '', // Map imageGradient to image
            inStock: isActuallyInStock, // Override with real inventory status
            inventory: inventoryItems.map(item => ({
                color: item.color,
                size: item.size,
                available: (item.totalStock - item.reservedStock) > 0,
                availableStock: item.totalStock - item.reservedStock
            }))
        };

        return NextResponse.json({ success: true, data: transformedProduct });
    }

    // UPDATE PRODUCT
    static async update(req, { params }) {
        await connectDB();
        const { id } = await params;

        // const user = isAdmin(req);
        // if (!user || user.role !== "admin") {
        //   return NextResponse.json(
        //     { message: "Admin access only" },
        //     { status: 403 }
        //   );
        // }

        const body = await req.json();
        const product = await Product.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // Transform MongoDB document to match frontend interface
        const transformedProduct = {
            ...product.toObject(),
            id: product._id.toString(), // Convert ObjectId to string and assign to id
            color: product.colors?.[0] || '', // Use first color for backward compatibility
            size: product.sizes || [], // Map sizes field
            reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
            imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
            image: product.imageGradient || '', // Map imageGradient to image
        };

        return NextResponse.json({ success: true, data: transformedProduct });
    }

    // DELETE PRODUCT
    static async delete(req, { params }) {
        await connectDB();
        const { id } = await params;

        // const user = isAdmin(req);
        // if (!user || user.role !== "admin") {
        //   return NextResponse.json(
        //     { message: "Admin access only" },
        //     { status: 403 }
        //   );
        // }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
        });
    }
}
