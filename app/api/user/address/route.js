import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function PATCH(request) {
    try {
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        console.log("Address Update Request Body:", body);
        const { street, city, state, zip, country } = body;

        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            {
                address: {
                    street,
                    city,
                    state,
                    zip,
                    country,
                },
            },
            { returnDocument: "after" }
        ).select("-password");

        console.log("Updated User from Value:", updatedUser);

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
