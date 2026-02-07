import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import { verifyToken } from "@/lib/jwt";

// DELETE item from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token) as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Find and delete the wishlist item
    const wishlistItem = await Wishlist.findOneAndDelete({
      _id: id,
      user: decoded.userId, // Ensure user can only delete their own items
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { success: false, message: "Wishlist item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove item from wishlist" },
      { status: 500 }
    );
  }
}
