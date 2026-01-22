import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, searchProducts } from '@/lib/products'

// AI-like responses for the chatbot
const chatResponses: { [key: string]: string[] } = {
  greeting: [
    'Hello! Welcome to Butterfly Couture. How can I assist you today?',
    'Hi there! I\'m here to help you find the perfect piece from our collection.',
    'Welcome! What can I help you with today?',
  ],
  products: [
    'We offer a curated collection of luxury fashion items including dresses, jackets, shoes, bags, and coats.',
    'Our collection features exquisite butterfly-inspired couture pieces handcrafted with premium materials.',
    'We have beautiful evening wear, day wear, accessories, and outerwear in our latest collections.',
  ],
  shipping: [
    'We offer free shipping on orders over $500. Standard shipping is $20, and expedited shipping for orders over $200 is $10.',
    'Free shipping is available for orders exceeding $500. Other shipping options range from $10-$20.',
  ],
  returns: [
    'We accept returns within 30 days of purchase. Items must be unworn and in original condition.',
    'Our return policy allows 30 days for returns with full refunds for unworn items.',
  ],
  payment: [
    'We accept all major credit cards, digital wallets, and secure payment methods at checkout.',
    'We securely accept Visa, Mastercard, American Express, and other payment options.',
  ],
  help: [
    'I can help you with product information, sizing, shipping details, and more. What would you like to know?',
    'Feel free to ask me about our products, collections, policies, or any other questions!',
  ],
}

function generateResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  // Check for product searches
  if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('dress') || lowerMessage.includes('jacket') || lowerMessage.includes('shoe') || lowerMessage.includes('bag')) {
    const products = getAllProducts()
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    return `I'd recommend checking out our ${randomProduct.category.toLowerCase()} collection. The "${randomProduct.name}" is a bestseller at $${randomProduct.price}. Would you like more details?`
  }

  // Check for specific keywords
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return chatResponses.greeting[Math.floor(Math.random() * chatResponses.greeting.length)]
  }
  if (lowerMessage.includes('ship') || lowerMessage.includes('delivery') || lowerMessage.includes('cost')) {
    return chatResponses.shipping[Math.floor(Math.random() * chatResponses.shipping.length)]
  }
  if (lowerMessage.includes('return') || lowerMessage.includes('exchange') || lowerMessage.includes('refund')) {
    return chatResponses.returns[Math.floor(Math.random() * chatResponses.returns.length)]
  }
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
    return chatResponses.payment[Math.floor(Math.random() * chatResponses.payment.length)]
  }
  if (lowerMessage.includes('product') || lowerMessage.includes('collection') || lowerMessage.includes('store')) {
    return chatResponses.products[Math.floor(Math.random() * chatResponses.products.length)]
  }
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('question')) {
    return chatResponses.help[Math.floor(Math.random() * chatResponses.help.length)]
  }

  // Default responses
  const defaultResponses = [
    'That\'s a great question! Is there anything specific about our products or services I can help with?',
    'I appreciate your question. Can you tell me more about what you\'re looking for?',
    'Thank you for your interest! Feel free to browse our collection or let me know if you need assistance.',
    'I\'m here to help! Would you like to know about our products, shipping, or anything else?',
  ]
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Simulate a small delay for realism
    await new Promise(resolve => setTimeout(resolve, 500))

    const response = generateResponse(message)

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[API] Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
