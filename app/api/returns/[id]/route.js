import { ReturnRequestController } from "@/controllers/returnRequestController";

export async function GET(request, context) {
    return await ReturnRequestController.getById(request, context);
}

export async function PATCH(request, context) {
    return await ReturnRequestController.updateStatus(request, context);
}
