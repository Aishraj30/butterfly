import mongoose, { Types } from 'mongoose'
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Inventory from "@/models/inventory";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const { transactionId, status = "paid" } = body;

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        // Only reduce stock if transitioning to 'paid' for the first time
        // Using order.status as the source of truth for inventory commitment
        const previouslyPaid = order.status === "paid";

        if (status === "paid") {
            order.status = "paid";
            order.paymentStatus = "paid";
        } else if (status === "failed") {
            order.status = "cancelled";
            order.paymentStatus = "failed";
        } else {
            order.paymentStatus = status;
        }

        if (transactionId) order.transactionId = transactionId;
        await order.save();

        if (order.status === "paid" && !previouslyPaid) {
            // REDUCE STOCK NOW
            console.log(`💰 [PAYMENT-SYNC] Order ${order.orderId} marked as PAID. Reducing final stock...`)
            for (const item of order.items) {
                try {
                    if (!item.productId) {
                        console.warn(`⚠️ [PAYMENT-SYNC] Skipping item ${item.name} - No Product ID.`);
                        continue;
                    }

                    const pId = new Types.ObjectId(item.productId);
                    const itemSize = item.size || 'N/A';
                    const itemColor = item.color || 'N/A';

                    // 🔍 MULTI-STAGE DYNAMIC MATCHING
                    let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });

                    if (!inventoryItem) {
                        console.log(`🔍 [PAYMENT-SYNC] No exact match for ${item.name} (${itemSize}/${itemColor}), trying Size-Only fallback...`);
                        inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: 'N/A' });
                    }

                    if (!inventoryItem) {
                        console.log(`🔍 [PAYMENT-SYNC] No Size-Only match, trying Generic fallback...`);
                        inventoryItem = await Inventory.findOne({ productId: pId, size: 'N/A', color: 'N/A' });
                    }

                    if (inventoryItem) {
                        console.log(`🎯 [PAYMENT-SYNC] Match Found! Record ID: ${inventoryItem._id}`);
                        await inventoryItem.commitSold(item.quantity);
                        console.log(`✅ [PAYMENT-SYNC] STOCK REDUCED: ${item.name} (-${item.quantity} units). New Total: ${inventoryItem.totalStock}`);
                    } else {
                        console.warn(`❌ [PAYMENT-SYNC] CRITICAL: No inventory record found for Product ID ${item.productId} (${item.name})`);
                    }
                } catch (itemError) {
                    console.error(`❌ [PAYMENT-SYNC] Error processing item ${item.name}:`, itemError);
                }
            }
        } else if (order.status === "cancelled" && !previouslyPaid) {
            // RELEASE STOCK IF FAILED
            console.log(`♻️ [PAYMENT-SYNC] Order ${order.orderId} FAILED. Releasing reserved stock...`)
            for (const item of order.items) {
                try {
                    if (!item.productId) continue;
                    const pId = new Types.ObjectId(item.productId);
                    const itemSize = item.size || 'N/A';
                    const itemColor = item.color || 'N/A';

                    let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });
                    if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: 'N/A' });
                    if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: 'N/A', color: 'N/A' });

                    if (inventoryItem) {
                        await inventoryItem.release(item.quantity);
                        console.log(`✅ [PAYMENT-SYNC] STOCK RELEASED: ${item.name} (+${item.quantity} units). New Available: ${inventoryItem.availableStock}`);
                    }
                } catch (err) {
                    console.error(`❌ [PAYMENT-SYNC] Error releasing stock for ${item.name}:`, err);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Order status updated and stock adjusted.",
            data: {
                orderId: order.orderId,
                status: order.status,
                paymentStatus: order.paymentStatus
            }
        });

    } catch (error: any) {
        console.error("Payment Confirmation Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
