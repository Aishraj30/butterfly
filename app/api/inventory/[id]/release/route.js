import { InventoryController } from "../../../../../controllers/inventoryController.js";

export async function POST(req, { params }) {
    const p = await params;
    return InventoryController.release(req, { params: p });
}
