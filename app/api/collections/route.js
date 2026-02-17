import { CollectionController } from "@/controllers/collectionController";

export async function GET(request) {
  return await CollectionController.getAll(request);
}

export async function POST(request) {
  return await CollectionController.create(request);
}

