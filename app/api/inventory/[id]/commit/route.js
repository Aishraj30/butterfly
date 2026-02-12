import { InventoryController } from "../../../../../controllers/inventoryController.js";

export async function POST(req, { params }) {
    const p = await params;
    return InventoryController.commit(req, { params: p });
}
