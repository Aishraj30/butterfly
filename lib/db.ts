// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  // We don't throw here to allow building without env vars if needed, 
  // but we warn for runtime.
  console.warn("MONGODB_URI is not defined");
}

/**
 * Global cache (important for Next.js hot reload)
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGODB_URI) return null;
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "butterfly",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected successfully");
  return cached.conn;
}

// --- MOCK DATABASE FOR CART & ACTIONS ---

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

const mockCarts = new Map<string, CartItem[]>();
const mockOrders: any[] = [];
const mockSubmissions: any[] = [];

export function getCart(sessionId: string): CartItem[] {
  return mockCarts.get(sessionId) || [];
}

export function addToCart(sessionId: string, item: CartItem): CartItem[] {
  const cart = getCart(sessionId);
  const existingItemIndex = cart.findIndex(
    (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, id: Math.random().toString(36).substr(2, 9) });
  }

  mockCarts.set(sessionId, cart);
  return cart;
}

export function removeFromCart(sessionId: string, productId: string, size: string, color: string): CartItem[] {
  let cart = getCart(sessionId);
  cart = cart.filter(
    (i) => !(i.productId === productId && i.size === size && i.color === color)
  );
  mockCarts.set(sessionId, cart);
  return cart;
}

export function updateCartItem(sessionId: string, productId: string, size: string, color: string, quantity: number): CartItem[] {
  const cart = getCart(sessionId);
  const item = cart.find(
    (i) => i.productId === productId && i.size === size && i.color === color
  );
  if (item) {
    item.quantity = quantity;
  }
  mockCarts.set(sessionId, cart);
  return cart;
}

export function clearCart(sessionId: string): void {
  mockCarts.delete(sessionId);
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
    return total + price * item.quantity;
  }, 0);
}

export function getShippingCost(subtotal: number): number {
  return subtotal > 1000000 ? 0 : 25000;
}

export function calculateTax(subtotal: number, state?: string): number {
  return Math.round(subtotal * 0.1); // 10% tax
}

export function createOrder(orderData: any): any {
  const order = { ...orderData, id: `ORD-${Date.now()}`, createdAt: new Date() };
  mockOrders.push(order);
  return order;
}

export function getOrdersByEmail(email: string): any[] {
  return mockOrders.filter((o) => o.customer?.email === email);
}

export function getAllOrders(): any[] {
  return mockOrders;
}

export function updateOrderStatus(id: string, status: string): any {
  const order = mockOrders.find(o => o.id === id);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
}

export function createContactSubmission(data: any): any {
  const submission = { ...data, id: `SUB-${Date.now()}`, createdAt: new Date() };
  mockSubmissions.push(submission);
  return submission;
}

export function getContactSubmissions(): any[] {
  return mockSubmissions;
}
