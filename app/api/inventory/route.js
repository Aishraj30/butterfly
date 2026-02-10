import { InventoryController } from "@/controllers/inventoryController";

export async function GET(req) {
    return InventoryController.getAll(req);
}

export async function POST(req) {
    return InventoryController.create(req);
}
