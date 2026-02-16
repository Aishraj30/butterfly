import { InventoryController } from "@/controllers/inventoryController";

export async function GET(request) {
    return await InventoryController.getAll(request);
}

export async function POST(request) {
    return await InventoryController.create(request);
}
