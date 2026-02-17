import { WishlistController } from "@/controllers/wishlistController";

export async function DELETE(request, { params }) {
    return await WishlistController.delete(request, { params });
}
