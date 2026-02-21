import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getAllProducts } from '@/lib/products'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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

    if (!process.env.OPENAI_API_KEY) {
      console.error('[API] OpenAI API Key is missing')
      return NextResponse.json(
        { success: false, error: 'AI Assistant currently unavailable' },
        { status: 503 }
      )
    }

    // Get current products for context
    const products = getAllProducts()
    const productsContext = products.map(p => `- ${p.name}: ${p.category} ($${p.price})`).join('\n')

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a luxury fashion assistant for Butterfly Couture. 
          Our brand is elegant, sophisticated, and premium.
          Treat users with high-end hospitality.
          
          Our Shipping Policy: Free shipping on orders over $500. Standard shipping is $20. Expedited is $10 for orders over $200.
          Our Return Policy: 30 days for unworn items in original condition.
          
          Here are some of our current products for reference:
          ${productsContext}
          
          If a user asks about products, recommend something specific from the list above. 
          Keep responses concise but polite and premium.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. How else can I help you?"

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('[API] Chat error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process message' },
      { status: 500 }
    )
  }
}
