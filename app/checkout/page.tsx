'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useCart } from '@/hooks/useCart'
import { submitCheckoutForm } from '@/lib/actions'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'United States',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'United States',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep < 3) {
      handleNextStep()
      return
    }

    // Submit order
    setLoading(true)

    const result = await submitCheckoutForm({
      ...formData,
      sameAsShipping,
      cartItems: cart.items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      tax: cart.tax,
      total: cart.total,
    })

    setLoading(false)

    if (result.success) {
      setOrderSuccess(true)
      setOrderId(result.data.id)
    } else {
      alert(result.error || 'Failed to place order')
    }
  }

  if (cartLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground/60">Loading checkout...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="font-serif text-4xl font-bold text-primary mb-6">Your cart is empty</h1>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (orderSuccess) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="bg-secondary border border-border rounded-sm p-12 space-y-6">
              <div className="text-5xl">✓</div>
              <h1 className="font-serif text-4xl font-bold text-primary">Order Confirmed!</h1>
              <p className="text-lg text-foreground/70">Thank you for your purchase</p>
              <div className="bg-background border border-border rounded-sm p-6 space-y-2 my-8">
                <p className="text-sm text-foreground/60">Order ID</p>
                <p className="font-mono text-lg font-bold text-primary">{orderId}</p>
                <p className="text-sm text-foreground/60 mt-4">A confirmation email has been sent to {formData.email}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/shop"
                  className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="px-8 py-3 border border-border rounded-sm hover:bg-secondary transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="font-serif text-4xl font-bold text-primary">Checkout</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Progress */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <button
                        onClick={() => setCurrentStep(step)}
                        className={`w-10 h-10 rounded-full font-semibold transition-colors flex-shrink-0 ${
                          step === currentStep
                            ? 'bg-primary text-primary-foreground'
                            : step < currentStep
                              ? 'bg-accent text-primary-foreground'
                              : 'bg-secondary border border-border text-foreground'
                        }`}
                      >
                        {step < currentStep ? '✓' : step}
                      </button>
                      {step < 3 && <div className={`h-1 flex-1 mx-2 ${step < currentStep ? 'bg-accent' : 'bg-border'}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-foreground/60 font-medium">
                  <span>Shipping</span>
                  <span>Billing</span>
                  <span>Payment</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Shipping */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-semibold text-lg text-foreground">Shipping Information</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>

                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />

                    <input
                      type="text"
                      name="shippingAddress"
                      placeholder="Street Address"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="shippingCity"
                        placeholder="City"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                      <input
                        type="text"
                        name="shippingState"
                        placeholder="State"
                        value={formData.shippingState}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="shippingZip"
                        placeholder="ZIP Code"
                        value={formData.shippingZip}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                      <select
                        name="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Billing */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-semibold text-lg text-foreground">Billing Information</h2>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-foreground">Same as shipping address</span>
                    </label>

                    {!sameAsShipping && (
                      <>
                        <input
                          type="text"
                          name="billingAddress"
                          placeholder="Street Address"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          required={!sameAsShipping}
                          className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="billingCity"
                            placeholder="City"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            required={!sameAsShipping}
                            className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          />
                          <input
                            type="text"
                            name="billingState"
                            placeholder="State"
                            value={formData.billingState}
                            onChange={handleInputChange}
                            required={!sameAsShipping}
                            className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="billingZip"
                            placeholder="ZIP Code"
                            value={formData.billingZip}
                            onChange={handleInputChange}
                            required={!sameAsShipping}
                            className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          />
                          <select
                            name="billingCountry"
                            value={formData.billingCountry}
                            onChange={handleInputChange}
                            className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-semibold text-lg text-foreground">Payment Information</h2>
                    <p className="text-sm text-foreground/70">This is a demo. No real payment will be processed.</p>

                    <div className="bg-secondary border border-border rounded-sm p-4 space-y-3">
                      <p className="font-semibold text-foreground">Order Summary:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${cart.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${cart.tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${cart.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="px-8 py-3 border border-border rounded-sm hover:bg-secondary transition-colors font-medium"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : currentStep === 3 ? 'Place Order' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <div className="border border-border rounded-sm p-6 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-primary">Order Summary</h2>

                <div className="space-y-3 border-t border-border pt-4 max-h-96 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                      <span className="text-foreground/70">
                        {item.productId} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        ${((item.quantity) * 1250).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Subtotal</span>
                    <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Shipping</span>
                    <span className="font-medium">
                      {cart.shipping === 0 ? <span className="text-green-600">Free</span> : `$${cart.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Tax</span>
                    <span className="font-medium">${cart.tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
