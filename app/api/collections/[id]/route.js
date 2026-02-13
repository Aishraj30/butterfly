import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/jwt";

// GET SINGLE COLLECTION (PUBLIC)
// Supports searching by both ID and Slug
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    let collection;
    // Check if it's a valid MongoDB ObjectId format, otherwise search by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      collection = await Collection.findById(id).populate("products");
    } else {
      collection = await Collection.findOne({ slug: id }).populate("products");
    }

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, collection });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

const getUser = (req) => {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || auth === "Bearer null") return null;
    return verifyToken(auth.split(" ")[1]);
  } catch (e) {
    return null;
  }
};

// ADD PRODUCTS TO COLLECTION (ADMIN)
export async function PUT(req, { params }) {
  try {
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

    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { slug: id };

    // Update the entire collection object
    const collection = await Collection.findOneAndUpdate(
      query,
      { $set: body },
      { new: true, runValidators: true }
    ).populate("products");

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      collection,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// DELETE COLLECTION (ADMIN)
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

  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: id }
    : { slug: id };

  const result = await Collection.findOneAndDelete(query);

  if (!result) {
    return NextResponse.json(
      { message: "Collection not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Collection deleted",
  });
}
