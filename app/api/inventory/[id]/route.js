import { InventoryController } from "@/controllers/inventoryController";

export async function GET(req, { params }) {
    return InventoryController.getById(req, { params });
}

export async function PUT(req, { params }) {
    return InventoryController.update(req, { params });
}

export async function DELETE(req, { params }) {
    return InventoryController.delete(req, { params });
}
