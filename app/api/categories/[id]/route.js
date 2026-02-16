import { CategoryController } from "@/controllers/categoryController";

export async function GET(request, { params }) {
    return await CategoryController.getById(request, { params });
}

export async function PUT(request, { params }) {
    return await CategoryController.update(request, { params });
}

export async function DELETE(request, { params }) {
    return await CategoryController.delete(request, { params });
}
