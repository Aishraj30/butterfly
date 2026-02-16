import { OrderController } from "@/controllers/orderController";

export async function GET(request, { params }) {
    return await OrderController.getById(request, { params });
}

export async function DELETE(request, { params }) {
    return await OrderController.delete(request, { params });
}
