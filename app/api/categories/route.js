import { CategoryController } from "@/controllers/categoryController";

export async function GET(request) {
    return await CategoryController.getAll(request);
}

export async function POST(request) {
    return await CategoryController.create(request);
}
