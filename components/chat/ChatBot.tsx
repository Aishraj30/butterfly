'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageSquare, X, Minimize2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  'Help me find the right size',
  'What are your best sellers?',
  'Tell me about shipping',
  'How do returns work?',
]

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! Welcome to Butterfly Couture. How can I help you today? I can assist with product discovery, sizing, shipping, and returns.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text?: string) => {
    const message = text || input.trim()
    if (!message) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('[ChatBot] Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
      return 'Our sizing guide is available on each product page. We offer XS to XXL. If you need help determining your size, I recommend checking the detailed measurements or contacting our team at hello@butterflycouture.com.'
    }

    if (lowerMessage.includes('best seller') || lowerMessage.includes('popular')) {
      return 'Our top sellers are the Silk Butterfly Gown, Crystal Wing Jacket, and Garden Bloom Dress. All are crafted with premium materials and exceptional attention to detail.'
    }

    if (lowerMessage.includes('ship') || lowerMessage.includes('delivery')) {
      return 'We offer free worldwide shipping on orders over $500. Standard shipping takes 5-7 business days. Express shipping (2-3 days) is also available for an additional fee.'
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
      return 'We offer hassle-free returns within 30 days of purchase. Items must be unworn with original tags. To start a return, visit your account or contact our support team.'
    }

    return 'Thank you for your question! For more detailed assistance, please visit our FAQ page or contact our team at hello@butterflycouture.com. We\'re here to help!'
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed sm:bottom-6 sm:right-6 bottom-4 right-4 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 hover:scale-110 duration-200"
        aria-label="Open chat"
      >
        <MessageSquare size={24} />
      </button>
    )
  }

  return (
    <div className="fixed sm:bottom-6 sm:right-6 bottom-4 right-4 sm:w-96 w-[calc(100vw-2rem)] sm:max-h-[32rem] max-h-[70vh] bg-background border border-border rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/95 to-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <MessageSquare size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Butterfly Assistant</h3>
            <p className="text-[10px] text-primary-foreground/70">Always here to help</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-primary-foreground/20 rounded transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-primary-foreground/20 rounded transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-secondary text-foreground rounded-tl-none border border-border/50'
                    }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground px-4 py-2 rounded-lg text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-xs text-foreground/60 font-medium">Quick questions:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSendMessage(question)}
                    className="w-full text-left px-4 py-2.5 text-xs bg-secondary/50 border border-border rounded-xl hover:bg-secondary hover:border-primary/30 transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 bg-secondary/30 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-md"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
