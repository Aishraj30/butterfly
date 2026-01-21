'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  // Mock data - would normally fetch based on params.id
  const product = {
    name: 'WHITE CASUAL T-SHIRT',
    price: 'IDR 100.000',
    originalPrice: 'IDR 200.000',
    description: 'Lorem ipsum dolor sit amet consectetur. Metus nibh dictum vel enim sollicitudin. Metus nibh a leo orci aliquam diam. Metus pretium purus augue malesuada metus. Nec suspendisse proin aliquam dolor ipsum. Quis id enim viverra et.',
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'
    ]
  };

  return (
    <main className="pt-40 pb-20 max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
            <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-xs font-bold px-2 py-1 flex items-center gap-1 rounded-sm">
              <Star size={12} fill="currentColor" /> 4.95
            </div>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="relative aspect-square bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div>
            <p className="text-gray-500 text-sm tracking-widest mb-2">MAN T-SHIRT</p>
            <h1 className="font-serif text-5xl text-[#4A4A4A] mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 line-through text-lg">{product.originalPrice}</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-50%</span>
            </div>
            <p className="text-3xl font-bold text-[#8B5E34] mt-2">{product.price}</p>
          </div>

          <div className="prose prose-sm text-gray-500">
            <p>{product.description}</p>
            <p className="mt-4">{product.description}</p>
          </div>

          {/* Size Selector */}
          <div>
            <h3 className="text-gray-500 mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center border text-sm transition-colors ${selectedSize === size
                    ? 'bg-[#8B5E34] text-white border-[#8B5E34]'
                    : 'border-gray-200 text-gray-500 hover:border-[#8B5E34]'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-3">
            <h3 className="text-gray-500">Quantity</h3>
            <div className="flex gap-4">
              <div className="flex items-center border border-gray-200 w-32 justify-between px-2 py-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-[#8B5E34]">
                  <Minus size={16} />
                </button>
                <span className="font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-[#8B5E34]">
                  <Plus size={16} />
                </button>
              </div>

              <button className="flex-1 bg-[#8B5E34] text-white font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-[#7A5229] transition-colors">
                ADD TO CART <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
