import { ProductController } from "@/controllers/productController";

export async function GET(request, { params }) {
  return await ProductController.getById(request, { params });
}

export async function PUT(request, { params }) {
  return await ProductController.update(request, { params });
}

export async function DELETE(request, { params }) {
  return await ProductController.delete(request, { params });
}

