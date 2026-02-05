import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/jwt";

const getUser = (req) => {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  return verifyToken(auth.split(" ")[1]);
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

  return NextResponse.json({ success: true, product });
}

// UPDATE PRODUCT (ADMIN)
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;

  const user = getUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { message: "Admin access only" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const product = await Product.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );

  return NextResponse.json({ success: true, product });
}

// DELETE PRODUCT (ADMIN)
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  const user = getUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { message: "Admin access only" },
      { status: 403 }
    );
  }

  await Product.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "Product deleted successfully",
  });
}
