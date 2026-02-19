import { ReturnRequestController } from "@/controllers/returnRequestController";

export async function GET(request) {
    return await ReturnRequestController.getAll(request);
}

export async function POST(request) {
    return await ReturnRequestController.create(request);
}
