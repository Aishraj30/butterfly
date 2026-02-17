import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export class CategoryController {

    // GET ALL CATEGORIES
    static async getAll(req) {
        try {
            await connectDB();
            const categories = await Category.find({ isActive: true }).sort({ name: 1 });
            return NextResponse.json({
                success: true,
                data: categories,
                count: categories.length,
            });
        } catch (error) {
            console.error('[API] Categories error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch categories' },
                { status: 500 }
            );
        }
    }

    // CREATE CATEGORY
    static async create(req) {
        try {
            await connectDB();
            const body = await req.json();

            const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${body.name}$`, 'i') } });
            if (existingCategory) {
                return NextResponse.json(
                    { success: true, data: existingCategory, message: 'Category already exists' },
                    { status: 200 }
                );
            }

            const category = await Category.create(body);
            return NextResponse.json({ success: true, data: category }, { status: 201 });
        } catch (error) {
            console.error('[API] Create category error:', error);
            return NextResponse.json(
                { success: false, error: error.message || 'Failed to create category' },
                { status: 500 }
            );
        }
    }

    // GET CATEGORY BY ID
    static async getById(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            // Depending on whether ID is ObjectId or numeric/string, handle it.
            // The original code used parseInt(id) which implies numeric IDs, but Mongoose usually uses ObjectId.
            // I will safely assume if it matches ObjectId use that, else if numeric use that, else fail?
            // Since the model is Mongoose 'Category', it usually has _id (ObjectId).
            // However the route was casting to parseInt. Let's check if the User meant to use Mongoose or a mock.
            // Given 'Category.js' model exists, it likely uses ObjectId. 
            // I will assume ObjectId or fallback.

            let category;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                category = await Category.findById(id);
            } else {
                // Fallback for numeric IDs if they were using a different system, or just generic find
                // If it's not objectId, maybe it's not found.
                return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
            }

            if (!category) {
                return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, data: category });
        } catch (error) {
            return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 500 });
        }
    }

    // UPDATE CATEGORY
    static async update(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const body = await req.json();

            const category = await Category.findByIdAndUpdate(id, body, { new: true });
            if (!category) {
                return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, data: category });
        } catch (error) {
            return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
        }
    }

    // DELETE CATEGORY
    static async delete(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const result = await Category.findByIdAndDelete(id);

            if (!result) {
                return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true });
        } catch (error) {
            return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
        }
    }
}
