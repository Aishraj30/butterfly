'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

const steps = ['Checkout', 'Shipping', 'Confirmation', 'Success'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  return (
    <main className="pt-40 pb-20 max-w-[1400px] mx-auto px-6">
      <div className="flex gap-4 mb-8 text-sm text-gray-400">
        {steps.map((step, idx) => (
          <span key={step} className={idx <= currentStep ? 'text-[#8B5E34] font-bold' : ''}>
            {step} {idx < steps.length - 1 && '/'}
          </span>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content Area */}
        <div className="flex-1 bg-[#FDF6E9] p-8 border border-[#E5D3B3] min-h-[500px]">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-gray-800 mb-6">CHECKOUT FORM</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="p-3 border border-gray-200 w-full" />
                <input type="text" placeholder="Last Name" className="p-3 border border-gray-200 w-full" />
              </div>
              <input type="email" placeholder="Email" className="p-3 border border-gray-200 w-full" />
              <input type="text" placeholder="Phone" className="p-3 border border-gray-200 w-full" />
              <input type="text" placeholder="Address" className="p-3 border border-gray-200 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Country" className="p-3 border border-gray-200 w-full" />
                <input type="text" placeholder="City" className="p-3 border border-gray-200 w-full" />
              </div>
              <button
                onClick={nextStep}
                className="w-full bg-[#8B5E34] text-white py-4 font-bold tracking-widest hover:bg-[#7A5229] transition-colors mt-8"
              >
                CONTINUE TO SHIPPING
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-gray-800 mb-6">SHIPPING DELIVERY</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-4 bg-white p-4 border border-gray-200 cursor-pointer">
                  <input type="radio" name="shipping" defaultChecked />
                  <span className="font-bold">JNE</span>
                  <span className="ml-auto text-gray-500">IDR 20.000</span>
                </label>
                <label className="flex items-center gap-4 bg-white p-4 border border-gray-200 cursor-pointer">
                  <input type="radio" name="shipping" />
                  <span className="font-bold">J&T</span>
                  <span className="ml-auto text-gray-500">IDR 22.000</span>
                </label>
              </div>
              <button
                onClick={nextStep}
                className="w-full bg-[#8B5E34] text-white py-4 font-bold tracking-widest hover:bg-[#7A5229] transition-colors mt-8"
              >
                CONTINUE TO PAYMENT
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-gray-800 mb-6">CONFIRMATION</h2>
              <div className="bg-white p-6 border border-gray-200 space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Order Number</span>
                  <span className="font-bold text-gray-900">#12345678</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>Oct 24, 2024</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg text-[#8B5E34]">
                  <span>Total</span>
                  <span>IDR 300.000</span>
                </div>
              </div>
              <button
                onClick={nextStep}
                className="w-full bg-[#8B5E34] text-white py-4 font-bold tracking-widest hover:bg-[#7A5229] transition-colors mt-8"
              >
                PAY NOW
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <CheckCircle size={64} className="text-green-500 mb-6" />
              <h2 className="font-serif text-4xl text-gray-800 mb-4">PAYMENT SUCCESS!</h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Your order has been confirmed. You will receive an email confirmation shortly.
              </p>
              <Link
                href="/"
                className="bg-[#8B5E34] text-white px-8 py-3 font-bold tracking-widest hover:bg-[#7A5229] transition-colors"
              >
                BACK TO HOME
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar (Hidden on success) */}
        {currentStep < 3 && (
          <div className="w-full lg:w-[350px]">
            <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-widest">ORDER SUMMARY</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-16 h-20 bg-gray-100 relative">
                  <Image src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" alt="Item" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-serif text-sm font-bold">White Casual T-Shirt</p>
                  <p className="text-xs text-gray-500">IDR 100.000</p>
                  <p className="text-xs text-gray-400">Qty: 1</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-20 bg-gray-100 relative">
                  <Image src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" alt="Item" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-serif text-sm font-bold">White Casual T-Shirt</p>
                  <p className="text-xs text-gray-500">IDR 100.000</p>
                  <p className="text-xs text-gray-400">Qty: 1</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>IDR 200.000</span></div>
                <div className="flex justify-between text-[#8B5E34]"><span>Discount</span><span>- IDR 50.000</span></div>
                <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>IDR 150.000</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
