import { ProductController } from "@/controllers/productController";

export async function GET(request) {
  return await ProductController.getAll(request);
}

export async function POST(request) {
  return await ProductController.create(request);
}

