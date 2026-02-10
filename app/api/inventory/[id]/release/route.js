import { InventoryController } from "../../../../../controllers/inventoryController.js";

export async function POST(req, { params }) {
    return InventoryController.release(req, { params });
}
