import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import { verifyToken } from "@/lib/jwt";

// Helper
const getUser = (req) => {
    try {
        const auth = req.headers.get("authorization");
        if (!auth || auth === "Bearer null") return null;
        return verifyToken(auth.split(" ")[1]);
    } catch (e) {
        return null;
    }
};

export class CollectionController {

    // GET ALL COLLECTIONS
    static async getAll(req) {
        try {
            await connectDB();
            const user = getUser(req);
            const filter = user && user.role === "admin" ? {} : { isActive: true };
            const collections = await Collection.find(filter).populate("products").sort({ createdAt: -1 });
            return NextResponse.json({ success: true, collections });
        } catch (error) {
            console.error('[API Collections] GET error:', error);
            return NextResponse.json({
                success: false,
                message: error.message || "Failed to fetch collections"
            }, { status: 500 });
        }
    }

    // CREATE COLLECTION (ADMIN)
    static async create(req) {
        try {
            await connectDB();
            // const user = getUser(req);
            // if (!user || user.role !== "admin") return NextResponse.json({ message: "Admin access only" }, { status: 403 });

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

    // GET SINGLE COLLECTION (ById or Slug)
    static async getById(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;

            let collection;
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

    // UPDATE COLLECTION
    static async update(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const body = await req.json();

            const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

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

            return NextResponse.json({ success: true, collection });
        } catch (error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }

    // DELETE COLLECTION
    static async delete(req, { params }) {
        await connectDB();
        const { id } = await params;

        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        const result = await Collection.findOneAndDelete(query);

        if (!result) {
            return NextResponse.json(
                { message: "Collection not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Collection deleted" });
    }
}
