
import mongoose, { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Inventory from "@/models/inventory";

// GET ORDER BY ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE ORDER (AND RELEASE STOCK)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        // Only release stock if it was RESERVED (pending) or COMMITTED (paid)
        // If it's already cancelled/failed, stock might have been released already, but let's be safe.
        // Assuming if status is 'pending', stock is reserved. If 'paid', stock is sold.

        console.log(`🗑️ [ORDER-DELETE] Deleting Order ${order.orderId}. Releasing stock...`);

        for (const item of order.items) {
            try {
                if (!item.productId) continue;

                const pId = new Types.ObjectId(item.productId);
                const itemSize = item.size || 'N/A';
                const itemColor = item.color || 'N/A';

                // Find inventory
                let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });
                if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: 'N/A' });
                if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: 'N/A', color: 'N/A' });

                if (inventoryItem) {
                    // Logic depends on order state
                    if (order.status === 'pending') {
                        // Pending order = Reserved stock. Release reservation.
                        await inventoryItem.release(item.quantity);
                        console.log(`✅ [ORDER-DELETE] Released RESERVED stock for ${item.name} (Available: ${inventoryItem.availableStock})`);
                    } else if (order.status === 'paid' || order.paymentStatus === 'paid') {
                        // Paid order = Sold stock. "Unsell" it -> increase totalStock.
                        await inventoryItem.restock(item.quantity);
                        // Also decrement sold count if you track it
                        inventoryItem.soldCount = Math.max(0, inventoryItem.soldCount - item.quantity);
                        await inventoryItem.save();
                        console.log(`✅ [ORDER-DELETE] Restocked SOLD item ${item.name} (Total: ${inventoryItem.totalStock})`);
                    } else {
                        console.log(`ℹ️ [ORDER-DELETE] Order status ${order.status} implies no active reservation to release.`);
                    }
                }
            } catch (err) {
                console.error(`❌ [ORDER-DELETE] Error releasing stock for item ${item.name}:`, err);
            }
        }

        await Order.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Order deleted and stock released." });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
