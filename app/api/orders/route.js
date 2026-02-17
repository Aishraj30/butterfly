import { OrderController } from "@/controllers/orderController";

export async function GET(request) {
    return await OrderController.getAll(request);
}

export async function POST(request) {
    return await OrderController.create(request);
}
