import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Inventory from "@/models/inventory";
import { verifyToken } from "@/lib/jwt";

// 🔒 helper: admin check
const isAdmin = (req) => {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];
  return verifyToken(token); // { userId, role }
};

// CREATE PRODUCT (ADMIN)
export async function POST(req) {
  try {
    await connectDB();

    const user = isAdmin(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access only" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const product = await Product.create(body);

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

// GET ALL PRODUCTS
export async function GET(req) {
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
}
