import { ContactController } from "@/controllers/contactController";

export async function GET(request) {
    return await ContactController.getAll(request);
}

export async function POST(request) {
    return await ContactController.create(request);
}
