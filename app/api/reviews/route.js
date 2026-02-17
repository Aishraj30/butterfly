import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import User from "@/models/User";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
    try {
        await connectDB();

        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, rating, reviewText } = body;

        if (!productId || !rating) {
            return NextResponse.json(
                { error: "Product ID and rating are required" },
                { status: 400 }
            );
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            productId,
            userId: decoded.userId,
        });

        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.reviewText = reviewText;
            await existingReview.save();
        } else {
            // Create new review
            const newReview = await Review.create({
                productId,
                userId: decoded.userId,
                rating,
                reviewText,
            });

            // Push review ID to Product and User arrays
            await Product.findByIdAndUpdate(productId, {
                $push: { reviews: newReview._id }
            });

            await User.findByIdAndUpdate(decoded.userId, {
                $push: { reviews: newReview._id }
            });
        }

        // --- Recalculate Product Rating & Count ---
        const stats = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    numReviews: { $sum: 1 }
                }
            }
        ]);

        let avgRating = 0;
        let numReviews = 0;

        if (stats.length > 0) {
            avgRating = stats[0].averageRating;
            numReviews = stats[0].numReviews;
        }

        await Product.findByIdAndUpdate(productId, {
            rating: avgRating,
            reviewsCount: numReviews
        });

        return NextResponse.json({
            success: true,
            message: "Review submitted successfully",
            rating: avgRating,
            reviewsCount: numReviews
        });

    } catch (error) {
        console.error("Error creating/updating review:", error);
        return NextResponse.json(
            { error: "Internal server error: " + error.message },
            { status: 500 }
        );
    }
}
