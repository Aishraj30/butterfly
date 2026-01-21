'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'WHITE CASUAL T-SHIRT', price: 100000, qty: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
    { id: 2, name: 'WHITE CASUAL T-SHIRT', price: 100000, qty: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
    { id: 3, name: 'WHITE CASUAL T-SHIRT', price: 100000, qty: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
  ]);

  const updateQty = (id: number, delta: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal - 50000; // Mock discount

  return (
    <main className="pt-40 pb-20 max-w-[1400px] mx-auto px-6">
      <h1 className="font-serif text-5xl text-[#4A4A4A] mb-12">CART</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8">
              <div className="w-32 aspect-[3/4] relative bg-gray-100 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl text-gray-800">{item.name}</h3>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-sm">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
                <p className="text-gray-500 mb-6">IDR {item.price.toLocaleString()}</p>
                <div className="flex items-center border border-gray-200 w-32 justify-between px-2 py-2">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-[#8B5E34]">
                    <Minus size={14} />
                  </button>
                  <span className="font-medium text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-[#8B5E34]">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-[#FDF6E9] p-4 text-gray-600 border border-[#E5D3B3] rounded-sm">
            <p className="text-sm">Notes: <br /> <span className="opacity-50">Eg: Please double check before packing.</span></p>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-[#FDF6E9]/50 p-8 border border-gray-100 sticky top-32">
            <h3 className="font-serif text-2xl mb-6 text-gray-800">SHOPPING INFO</h3>

            <div className="relative mb-6">
              <div className="bg-[#E5D3B3]/20 p-3 text-sm text-center border border-[#E5D3B3] text-[#8B5E34] mb-4">
                Hooray! You have promo code! <span className="underline cursor-pointer font-bold">Use promo code</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>IDR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4 border-gray-200">
                <span>Total</span>
                <span>IDR {total.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full bg-[#8B5E34] text-white py-4 text-center font-bold tracking-widest hover:bg-[#7A5229] transition-colors">
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
