import { CollectionController } from "@/controllers/collectionController";

export async function POST(request) {
    return await CollectionController.reorder(request);
}
