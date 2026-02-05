import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            default: () => "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        },
        customer: {
            name: String,
            email: String,
            phone: String,
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                name: String,
                price: Number,
                quantity: Number,
                size: String,
                color: String,
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        shipping: {
            address: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        billing: {
            address: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
