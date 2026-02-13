import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/jwt";

// helper
const getUser = (req) => {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || auth === "Bearer null") return null;
    return verifyToken(auth.split(" ")[1]);
  } catch (e) {
    return null;
  }
};

// CREATE COLLECTION (ADMIN)
export async function POST(req) {
  try {
    await connectDB();

    // const user = getUser(req);
    // if (!user || user.role !== "admin") {
    //   return NextResponse.json(
    //     { message: "Admin access only" },
    //     { status: 403 }
    //   );
    // }

    const body = await req.json();
    const collection = await Collection.create(body);

    return NextResponse.json(
      { success: true, collection },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// GET ALL COLLECTIONS
export async function GET(req) {
  await connectDB();

  const user = getUser(req);
  const filter = user && user.role === "admin" ? {} : { isActive: true };

  const collections = await Collection.find(filter).populate("products").sort({ createdAt: -1 });

  return NextResponse.json({ success: true, collections });
}
