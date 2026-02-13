import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Inventory from "@/models/inventory";
import { verifyToken } from "@/lib/jwt";

const getUser = (req) => {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || auth === "Bearer null") return null;
    return verifyToken(auth.split(" ")[1]);
  } catch (e) {
    return null;
  }
};

// GET PRODUCT BY ID (PUBLIC)
export async function GET(req, { params }) {
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

// UPDATE PRODUCT (ADMIN)
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;

  // const user = getUser(req);
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

// DELETE PRODUCT (ADMIN)
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  // const user = getUser(req);
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
