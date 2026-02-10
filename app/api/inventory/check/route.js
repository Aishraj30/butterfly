import { InventoryController } from "@/controllers/inventoryController";

export async function POST(req) {
    return InventoryController.checkStock(req);
}
