'use client'

import Link from 'next/link'
import { User, ShoppingCart, ChevronDown, Heart } from 'lucide-react'
import { useState } from 'react'
import { CartDrawer } from './CartDrawer'

const navigation = [
  { name: 'Catalog', href: '/catalog', hasDropdown: true },
  { name: 'Sale', href: '/sale' },
  { name: 'New Arrival', href: '/new-arrival' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 w-full z-50 py-8">
      <nav className="max-w-[1400px] mx-auto px-6 grid grid-cols-3 items-center">
        {/* Left Navigation */}
        <div className="flex items-center gap-8">
          {navigation.slice(0, 2).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center gap-1 text-[13px] font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors"
            >
              {item.name}
              {item.hasDropdown && <ChevronDown size={12} className="mt-[2px] opacity-70" />}
            </Link>
          ))}
        </div>

        {/* Center Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex-shrink-0">
            <span className="font-serif text-4xl font-bold tracking-[0.3em] text-white italic">
              BUTTERFLY
            </span>
          </Link>
        </div>

        {/* Right Navigation & Actions */}
        <div className="flex items-center justify-end gap-8">
          <div className="hidden lg:flex items-center gap-8">
            {navigation.slice(2).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 text-white/90 ml-4">
            <Link href="/wishlist" className="hover:text-white transition-colors">
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link href="/account" className="hover:text-white transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center hover:text-white transition-colors cursor-pointer relative"
              aria-label="Open Cart"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
