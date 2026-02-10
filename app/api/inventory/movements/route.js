import { InventoryController } from "@/controllers/inventoryController";

export async function GET(req) {
    return InventoryController.getMovements(req);
}
