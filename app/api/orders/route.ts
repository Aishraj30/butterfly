import mongoose, { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Contact from '@/models/Contact'
import Inventory from '@/models/inventory'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const {
      items,
      total,
      customer,
      shipping: shippingAddress,
      billing: billingAddress,
      paymentMethod = 'COD',
      paymentStatus = 'pending',
      transactionId = ''
    } = body

    // Validate required fields
    if (!items?.length || !customer?.email || !shippingAddress?.address || !billingAddress?.address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const order = await Order.create({
      items,
      total: Math.round(total * 100) / 100,
      customer,
      shipping: shippingAddress,
      billing: billingAddress,
      status: 'pending',
      paymentMethod,
      paymentStatus,
      transactionId
    })

    // --- Dynamic Inventory Synchronization Logic ---
    try {
      console.log(`🚀 [INVENTORY] Synchronizing stock for Order: ${order.orderId}`);

      for (const item of items) {
        if (!item.productId) {
          console.warn(`⚠️ [INVENTORY] Skipping item ${item.name} - No Product ID provided.`);
          continue;
        }

        // Validate Product ID
        if (!Types.ObjectId.isValid(item.productId)) {
          console.error(`❌ [INVENTORY] Invalid Product ID format: ${item.productId} for item: ${item.name}`);
          continue;
        }

        const pId = new Types.ObjectId(item.productId);
        const itemSize = item.size || 'N/A';
        const itemColor = item.color || 'N/A';

        // 🔍 MULTI-STAGE DYNAMIC MATCHING
        let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });

        if (!inventoryItem) {
          console.log(`🔍 [INVENTORY] No exact match for ${item.name} (${itemSize}/${itemColor}), trying Size-Only fallback...`);
          inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: 'N/A' });
        }

        if (!inventoryItem) {
          console.log(`🔍 [INVENTORY] No Size-Only match, trying Generic fallback...`);
          inventoryItem = await Inventory.findOne({ productId: pId, size: 'N/A', color: 'N/A' });
        }

        if (inventoryItem) {
          console.log(`🎯 [INVENTORY] Match Found! Inventory Record ID: ${inventoryItem._id}`);

          // Trigger persistent update
          await inventoryItem.reserve(item.quantity);
          console.log(`🔒 [INVENTORY] Reserved ${item.quantity} units. New Available: ${inventoryItem.availableStock}`);

          if (paymentMethod === 'COD') {
            await inventoryItem.commitSold(item.quantity);
            console.log(`✅ [INVENTORY] COD Order: Committed ${item.quantity} units to SOLD.`);
          }
        } else {
          console.warn(`❌ [INVENTORY] CRITICAL: No inventory record found in DB for Product ID ${item.productId} (${item.name})`);
        }
      }
    } catch (inventoryError: any) {
      console.error('❌ [INVENTORY] System Failure during sync:', inventoryError.message);
    }
    // ----------------------------------------------

    // Create order confirmation email notification (saving to database as contact submission)
    await Contact.create({
      name: customer.name,
      email: customer.email,
      subject: `Order Confirmation: ${order.orderId}`,
      message: `Your order has been received. Order ID: ${order.orderId}. Total: IDR ${order.total.toLocaleString()}`,
    })

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully. Please check your email for confirmation.',
    })
  } catch (error: any) {
    console.error('[API] Orders POST error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const email = request.nextUrl.searchParams.get('email')
    const orders = email ? await Order.find({ 'customer.email': email }).sort({ createdAt: -1 }) : await Order.find({}).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    })
  } catch (error: any) {
    console.error('[API] Orders GET error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
