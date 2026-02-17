import { CollectionController } from "@/controllers/collectionController";

export async function GET(request, { params }) {
  return await CollectionController.getById(request, { params });
}

export async function PUT(request, { params }) {
  return await CollectionController.update(request, { params });
}

export async function DELETE(request, { params }) {
  return await CollectionController.delete(request, { params });
}

