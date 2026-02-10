import { NextResponse } from "next/server";
import connectDB from "../lib/db.js";
import Inventory from "../models/inventory.js";
import Product from "../models/Product.js"; // Optional: to verify product existence
import InventoryMovement from "../models/InventoryMovement.js";

// Helper to log movement
async function logMovement({ inventoryId, productId, type, quantity, previousStock, newStock, reason, referenceId, performedBy }) {
    try {
        await InventoryMovement.create({
            inventoryId,
            productId,
            type,
            quantity,
            previousStock,
            newStock,
            reason,
            referenceId,
            performedBy
        });
    } catch (err) {
        console.error("Failed to log inventory movement:", err);
    }
}

export class InventoryController {

    // =====================
    // Get All / Filter Inventory
    // =====================
    static async getAll(request) {
        try {
            await connectDB();
            const { searchParams } = new URL(request.url);
            const productId = searchParams.get("productId");
            const lowStock = searchParams.get("lowStock");
            const status = searchParams.get("status");

            let query = {};
            if (productId) query.productId = productId;
            if (status) query.status = status;
            if (lowStock === 'true') {
                // Find where totalStock <= lowStockThreshold
                // This is tricky because lowStockThreshold is a field in the doc.
                // Mongoose allows $expr to compare fields.
                query.$expr = { $lte: ["$totalStock", "$lowStockThreshold"] };
            }

            const items = await Inventory.find(query).populate("productId", "name brand");

            return NextResponse.json(items, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Get Single Inventory Item
    // =====================
    static async getById(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const item = await Inventory.findById(id).populate("productId", "name brand image");

            if (!item) {
                return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
            }

            return NextResponse.json(item, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Create Inventory Item
    // =====================
    static async create(request) {
        try {
            await connectDB();
            const body = await request.json();

            // Check if product exists
            const productExists = await Product.findById(body.productId);
            if (!productExists) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }

            // Check for duplicate sku or (productId + color + size)
            const existing = await Inventory.findOne({
                $or: [
                    { sku: body.sku },
                    { productId: body.productId, color: body.color, size: body.size }
                ]
            });

            if (existing) {
                return NextResponse.json({ error: "Inventory item already exists (SKU or Variant duplicate)" }, { status: 409 });
            }

            const newItem = new Inventory(body);
            await newItem.save();

            // Log INITIAL creation
            await logMovement({
                inventoryId: newItem._id,
                productId: newItem.productId,
                type: "IN",
                quantity: newItem.totalStock,
                previousStock: 0,
                newStock: newItem.totalStock,
                reason: "Initial Stock",
                referenceId: "SETUP"
            });

            return NextResponse.json(newItem, { status: 201 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Update Inventory Details
    // =====================
    static async update(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const body = await request.json();

            // Get previous state for logging
            const originalItem = await Inventory.findById(id);
            if (!originalItem) {
                return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
            }

            const previousStock = originalItem.totalStock;

            const updatedItem = await Inventory.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true
            });

            // Log if stock changed manually via update
            if (updatedItem.totalStock !== previousStock) {
                const diff = updatedItem.totalStock - previousStock;
                await logMovement({
                    inventoryId: updatedItem._id,
                    productId: updatedItem.productId,
                    type: "ADJUSTMENT",
                    quantity: Math.abs(diff), // Magnitude of change
                    previousStock: previousStock,
                    newStock: updatedItem.totalStock,
                    reason: "Manual Adjustment (Update API)",
                    referenceId: "ADMIN_UPDATE"
                });
            }

            return NextResponse.json(updatedItem, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Delete Inventory Item
    // =====================
    static async delete(request, { params }) {
        try {
            await connectDB();
            const { id } = params;

            const deletedItem = await Inventory.findByIdAndDelete(id);

            if (!deletedItem) {
                return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "Inventory item deleted" }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Check Availability
    // =====================
    static async checkStock(request) {
        try {
            await connectDB();
            const body = await request.json();
            const { productId, color, size, quantity } = body;

            const item = await Inventory.findOne({ productId, color, size });
            if (!item) {
                return NextResponse.json({ error: "Item variant not found", available: false }, { status: 404 });
            }

            const canFulfill = item.canFulfill(quantity || 1);

            return NextResponse.json({
                available: canFulfill,
                availableStock: item.availableStock,
                status: item.status
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Reserve Stock
    // =====================
    static async reserve(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const { quantity, referenceId } = await request.json();

            const item = await Inventory.findById(id);
            if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

            const previousReserved = item.reservedStock;
            await item.reserve(quantity);

            await logMovement({
                inventoryId: item._id,
                productId: item.productId,
                type: "RESERVED",
                quantity: quantity,
                previousStock: previousReserved, // documenting reserved change contextually
                newStock: item.reservedStock,
                reason: "Allocated to Order",
                referenceId: referenceId || "UNKNOWN_ORDER"
            });

            return NextResponse.json({ message: "Stock reserved", item }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    // =====================
    // Release Stock
    // =====================
    static async release(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const { quantity, referenceId } = await request.json();

            const item = await Inventory.findById(id);
            if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

            const previousReserved = item.reservedStock;
            await item.release(quantity);

            await logMovement({
                inventoryId: item._id,
                productId: item.productId,
                type: "RELEASED",
                quantity: quantity,
                previousStock: previousReserved,
                newStock: item.reservedStock,
                reason: "Order Cancelled/Expired",
                referenceId: referenceId || "UNKNOWN_ORDER"
            });

            return NextResponse.json({ message: "Stock released", item }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    // =====================
    // Commit Sold Stock
    // =====================
    static async commit(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const { quantity, referenceId } = await request.json();

            const item = await Inventory.findById(id);
            if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

            const previousTotal = item.totalStock;
            await item.commitSold(quantity);

            await logMovement({
                inventoryId: item._id,
                productId: item.productId,
                type: "SOLD",
                quantity: quantity,
                previousStock: previousTotal,
                newStock: item.totalStock,
                reason: "Order Fulfilled",
                referenceId: referenceId || "UNKNOWN_ORDER"
            });

            return NextResponse.json({ message: "Stock committed (sold)", item }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    // =====================
    // Restock
    // =====================
    static async restock(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const { quantity, reason } = await request.json();

            const item = await Inventory.findById(id);
            if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

            const previousTotal = item.totalStock;
            await item.restock(quantity);

            await logMovement({
                inventoryId: item._id,
                productId: item.productId,
                type: "IN",
                quantity: quantity,
                previousStock: previousTotal,
                newStock: item.totalStock,
                reason: reason || "Restock Shipment",
                referenceId: "RESTOCK_" + Date.now()
            });

            return NextResponse.json({ message: "Stock replenished", item }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    // =====================
    // Get Movements (History)
    // =====================
    static async getMovements(request) {
        try {
            await connectDB();
            const { searchParams } = new URL(request.url);
            const inventoryId = searchParams.get("inventoryId");
            const productId = searchParams.get("productId");
            const type = searchParams.get("type");

            let query = {};
            if (inventoryId) query.inventoryId = inventoryId;
            if (productId) query.productId = productId;
            if (type) query.type = type;

            const movements = await InventoryMovement.find(query)
                .sort({ createdAt: -1 })
                .populate("performedBy", "name email");

            return NextResponse.json(movements, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
