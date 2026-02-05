import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
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

    return NextResponse.json(
      { success: true, product },
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
  return NextResponse.json({ success: true, products });
}
