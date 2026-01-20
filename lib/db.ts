// In-memory database for Butterfly Couture
// This simulates a real database with products, orders, and user data

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  color: string[]
  size: string[]
  images: string[]
  rating: number
  reviews: number
  inStock: boolean
  collection: string
}

export interface CartItem {
  productId: string
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  customer: {
    name: string
    email: string
    phone: string
  }
  shipping: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billing: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
}

// Products Database
const products: Map<string, Product> = new Map([
  ['1', {
    id: '1',
    name: 'Butterfly Silk Gown',
    description: 'Luxurious hand-crafted evening gown featuring butterfly-inspired embroidery and premium Italian silk.',
    price: 2850,
    category: 'Dresses',
    color: ['Black', 'Champagne', 'Blush'],
    size: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/products/gown-1.jpg', '/products/gown-2.jpg', '/products/gown-3.jpg'],
    rating: 4.9,
    reviews: 128,
    inStock: true,
    collection: 'Evening Wear'
  }],
  ['2', {
    id: '2',
    name: 'Crystal Wing Jacket',
    description: 'Statement piece crafted blazer with delicate crystal embellishments resembling butterfly wings.',
    price: 1650,
    category: 'Jackets',
    color: ['Navy', 'Emerald', 'White'],
    size: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/products/jacket-1.jpg', '/products/jacket-2.jpg'],
    rating: 4.8,
    reviews: 95,
    inStock: true,
    collection: 'Outerwear'
  }],
  ['3', {
    id: '3',
    name: 'Garden Bloom Dress',
    description: 'Day dress adorned with hand-painted floral patterns inspired by garden butterflies.',
    price: 890,
    category: 'Dresses',
    color: ['Lavender', 'Sage', 'Coral'],
    size: ['XS', 'S', 'M', 'L'],
    images: ['/products/dress-1.jpg', '/products/dress-2.jpg'],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    collection: 'Day Wear'
  }],
  ['4', {
    id: '4',
    name: 'Metamorphosis Shoes',
    description: 'Handcrafted leather heels with butterfly-shaped heel design.',
    price: 695,
    category: 'Footwear',
    color: ['Black', 'Gold', 'Silver'],
    size: ['5', '6', '7', '8', '9', '10'],
    images: ['/products/shoes-1.jpg', '/products/shoes-2.jpg'],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    collection: 'Accessories'
  }],
  ['5', {
    id: '5',
    name: 'Delicate Wings Bag',
    description: 'Luxury leather clutch with subtle butterfly wing embossing.',
    price: 1250,
    category: 'Bags',
    color: ['Tan', 'Burgundy', 'Black'],
    size: ['One Size'],
    images: ['/products/bag-1.jpg', '/products/bag-2.jpg'],
    rating: 4.8,
    reviews: 89,
    inStock: true,
    collection: 'Accessories'
  }],
  ['6', {
    id: '6',
    name: 'Aurora Feather Coat',
    description: 'Premium winter coat with light feather detailing and butterfly motif.',
    price: 3200,
    category: 'Coats',
    color: ['Camel', 'Charcoal', 'Cream'],
    size: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/products/coat-1.jpg', '/products/coat-2.jpg'],
    rating: 4.9,
    reviews: 74,
    inStock: true,
    collection: 'Outerwear'
  }],
])

// Orders Database
const orders: Map<string, Order> = new Map()

// Contact Submissions Database
const contactSubmissions: Map<string, ContactSubmission> = new Map()

// Cart Sessions (stored by session ID)
const carts: Map<string, CartItem[]> = new Map()

// ============ PRODUCT OPERATIONS ============

export function getAllProducts(): Product[] {
  return Array.from(products.values())
}

export function getProductById(id: string): Product | undefined {
  return products.get(id)
}

export function getProductsByCategory(category: string): Product[] {
  return Array.from(products.values()).filter(p => p.category === category)
}

export function getProductsByCollection(collection: string): Product[] {
  return Array.from(products.values()).filter(p => p.collection === collection)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return Array.from(products.values()).filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  )
}

// ============ CART OPERATIONS ============

export function getCart(sessionId: string): CartItem[] {
  return carts.get(sessionId) || []
}

export function addToCart(sessionId: string, item: CartItem): CartItem[] {
  const cart = carts.get(sessionId) || []
  const existingItem = cart.find(
    i => i.productId === item.productId && i.size === item.size && i.color === item.color
  )

  if (existingItem) {
    existingItem.quantity += item.quantity
  } else {
    cart.push(item)
  }

  carts.set(sessionId, cart)
  return cart
}

export function removeFromCart(sessionId: string, productId: string, size: string, color: string): CartItem[] {
  const cart = carts.get(sessionId) || []
  const filtered = cart.filter(
    i => !(i.productId === productId && i.size === size && i.color === color)
  )
  carts.set(sessionId, filtered)
  return filtered
}

export function updateCartItem(sessionId: string, productId: string, size: string, color: string, quantity: number): CartItem[] {
  const cart = carts.get(sessionId) || []
  const item = cart.find(i => i.productId === productId && i.size === size && i.color === color)
  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      return removeFromCart(sessionId, productId, size, color)
    }
  }
  carts.set(sessionId, cart)
  return cart
}

export function clearCart(sessionId: string): void {
  carts.delete(sessionId)
}

// ============ ORDER OPERATIONS ============

export function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
  const id = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const order: Order = {
    ...orderData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  orders.set(id, order)
  return order
}

export function getOrder(orderId: string): Order | undefined {
  return orders.get(orderId)
}

export function getOrdersByEmail(email: string): Order[] {
  return Array.from(orders.values()).filter(o => o.customer.email === email)
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | undefined {
  const order = orders.get(orderId)
  if (order) {
    order.status = status
    order.updatedAt = new Date()
    orders.set(orderId, order)
  }
  return order
}

// ============ CONTACT OPERATIONS ============

export function createContactSubmission(data: Omit<ContactSubmission, 'id' | 'createdAt'>): ContactSubmission {
  const id = `CONTACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const submission: ContactSubmission = {
    ...data,
    id,
    createdAt: new Date(),
  }
  contactSubmissions.set(id, submission)
  return submission
}

export function getContactSubmissions(): ContactSubmission[] {
  return Array.from(contactSubmissions.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )
}

// ============ UTILITY FUNCTIONS ============

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const product = getProductById(item.productId)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)
}

export function calculateTax(subtotal: number, state: string): number {
  // Simplified tax calculation (6-8% depending on state)
  const taxRates: { [key: string]: number } = {
    CA: 0.0825,
    NY: 0.08,
    TX: 0.0625,
    FL: 0.07,
    default: 0.07,
  }
  const rate = taxRates[state] || taxRates.default
  return Math.round(subtotal * rate * 100) / 100
}

export function getShippingCost(subtotal: number): number {
  if (subtotal >= 500) return 0 // Free shipping over $500
  if (subtotal >= 200) return 10
  return 20
}
