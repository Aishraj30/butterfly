import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Inventory from "@/models/inventory";

export async function POST(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const body = await req.json();
        const { transactionId, status = "paid" } = body;

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        const previouslyPaid = order.paymentStatus === "paid";
        order.paymentStatus = status;

        // If the incoming status is 'paid', also update the main order status to 'paid'
        if (status === "paid") {
            order.status = "paid";
        }

        if (transactionId) order.transactionId = transactionId;
        await order.save();

        if (status === "paid" && !previouslyPaid) {
            console.log(`💳 [PAYMENT] Order ${id} marked as PAID. Reducing stock for ${order.items.length} items...`);

            for (const item of order.items) {
                try {
                    const pId = item.productId;
                    const itemSize = item.size || 'N/A';
                    const itemColor = item.color || 'N/A';

                    console.log(`🔍 [PAYMENT] Searching inventory for Product: ${pId}, Size: ${itemSize}, Color: ${itemColor}`);

                    // 🔍 MULTI-STAGE DYNAMIC MATCHING
                    let inventoryItem = await Inventory.findOne({
                        productId: new mongoose.Types.ObjectId(pId),
                        size: itemSize,
                        color: itemColor
                    });

                    if (!inventoryItem) {
                        console.log(`🔍 [PAYMENT] No exact match, trying Size-Only fallback (Size: ${itemSize})...`);
                        inventoryItem = await Inventory.findOne({
                            productId: new mongoose.Types.ObjectId(pId),
                            size: itemSize,
                            color: 'N/A'
                        });
                    }

                    if (!inventoryItem) {
                        console.log(`🔍 [PAYMENT] No Size-Only match, trying Generic fallback (N/A/N/A)...`);
                        inventoryItem = await Inventory.findOne({
                            productId: new mongoose.Types.ObjectId(pId),
                            size: 'N/A',
                            color: 'N/A'
                        });
                    }

                    if (inventoryItem) {
                        await inventoryItem.commitSold(item.quantity);
                        console.log(`✅ [PAYMENT] Stock committed for ${item.name}. New Sold: ${inventoryItem.soldCount}, New Total: ${inventoryItem.totalStock}`);
                    } else {
                        console.error(`❌ [PAYMENT] CRITICAL: No inventory record found for Product ${pId} (${item.name})`);
                    }
                } catch (itemError) {
                    console.error(`❌ [PAYMENT] Error processing item ${item.name || 'unknown'}:`, itemError);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Payment status updated and stock adjusted.",
            order: {
                id: order._id,
                status: order.status,
                paymentStatus: order.paymentStatus
            }
        });

    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
