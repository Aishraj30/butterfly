'use client'

import Image from 'next/image';
import Link from 'next/link';

const products = [
    {
        id: 1,
        name: 'Floral Summer Dress',
        price: 'IDR 300.000',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2574&auto=format&fit=crop',
        tag: 'NEW',
        tagColor: 'bg-green-600'
    },
    {
        id: 2,
        name: 'Abstract Print Shirt',
        price: 'IDR 250.000',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=2576&auto=format&fit=crop',
        tag: 'HOT',
        tagColor: 'bg-red-500'
    },
    {
        id: 3,
        name: 'Classic Yellow Dress',
        price: 'IDR 450.000',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2583&auto=format&fit=crop',
        tag: 'SALE',
        tagColor: 'bg-orange-500'
    },
    {
        id: 4,
        name: 'Navy Casual Shirt',
        price: 'IDR 280.000',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2292&auto=format&fit=crop',
        tag: 'NEW',
        tagColor: 'bg-green-600'
    }
];

export function NewArrivals() {
    return (
        <section className="py-12 px-4 max-w-[1400px] mx-auto bg-[#E5D3B3]/20"> {/* Light beige bg matching design */}
            <div className="mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#4A4A4A] uppercase tracking-wide">
                    NEW ARRIVALS
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className={`absolute top-4 right-4 ${product.tagColor} text-white text-xs font-bold px-2 py-1 rounded-sm`}>
                                {product.tag}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-serif text-xl text-gray-900">{product.name}</h3>
                            <p className="text-gray-500">{product.price}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <button className="bg-[#8B5E34] text-white px-8 py-3 text-sm font-bold tracking-widest hover:bg-[#7A5229] transition-colors">
                    SEE MORE
                </button>
            </div>
        </section>
    );
}
