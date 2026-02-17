import { ReviewController } from "@/controllers/reviewController";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    return await ReviewController.create(req, { params });
}

export async function GET(req, { params }) {
    return await ReviewController.getByProduct(req, { params });
}
