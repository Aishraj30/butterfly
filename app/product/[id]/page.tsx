'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Minus, Plus, ShoppingCart, Heart, Filter, Grid, List } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - would normally fetch based on params.id
  const product = {
    name: 'WHITE CASUAL T-SHIRT',
    price: 'IDR 100.000',
    originalPrice: 'IDR 200.000',
    description: 'Lorem ipsum dolor sit amet consectetur. Metus nibh dictum vel enim sollicitudin. Metus nibh a leo orci aliquam diam. Metus pretium purus augue malesuada metus. Nec suspendisse proin aliquam dolor ipsum. Quis id enim viverra et.',
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['black', 'white', 'gray', 'navy', 'brown'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'
    ]
  };

  // Related products
  const relatedProducts = [
    { id: 1, name: 'CASUAL SHIRT', price: 'IDR 150.000', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80' },
    { id: 2, name: 'FORMAL SHIRT', price: 'IDR 200.000', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80' },
    { id: 3, name: 'SPORT TEE', price: 'IDR 120.000', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80' },
    { id: 4, name: 'POLO SHIRT', price: 'IDR 180.000', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  ];

  return (
    <main className="pt-10 pb-20 w-full bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div>
          {/* Product Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
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
            <div className="space-y-8 -mt-10">
              <div>
                <p className="text-gray-500 text-xs tracking-widest mb-2">MAN T-SHIRT</p>
                <h1 className="font-serif text-4xl text-[#4A4A4A] mb-4">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 line-through text-base">{product.originalPrice}</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-50%</span>
                </div>
                <p className="text-2xl font-bold text-[#8B5E34] mt-2">{product.price}</p>
              </div>

              <div className="prose prose-sm text-gray-500 text-sm">
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

          {/* Related Products */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-black">RELATED PRODUCTS</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-2 border border-black text-black bg-white"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-2 border border-black text-black bg-white"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {relatedProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart size={16} />
                    </button>
                  </div>
                  <h3 className="font-medium text-sm mb-1 text-black">{product.name}</h3>
                  <p className="font-bold text-black">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </main>
  )
}
