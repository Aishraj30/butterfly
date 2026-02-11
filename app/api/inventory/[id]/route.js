import { InventoryController } from "@/controllers/inventoryController";

export async function GET(req, { params }) {
    const p = await params;
    return InventoryController.getById(req, { params: p });
}

export async function PUT(req, { params }) {
    const p = await params;
    return InventoryController.update(req, { params: p });
}

export async function DELETE(req, { params }) {
    const p = await params;
    return InventoryController.delete(req, { params: p });
}
