'use client'

import Link from 'next/link'
import { User, ShoppingCart, ChevronDown, Heart } from 'lucide-react'
import { useState } from 'react'
<<<<<<< HEAD
import { Menu, X, Search, ShoppingBag, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
=======
import { CartDrawer } from './CartDrawer'
>>>>>>> butterfly

const navigation = [
  { name: 'Catalog', href: '/catalog', hasDropdown: true },
  { name: 'Sale', href: '/sale' },
  { name: 'New Arrival', href: '/new-arrival' },
  { name: 'About', href: '/about' },
]

export function Header() {
<<<<<<< HEAD
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-serif text-2xl font-bold text-primary">
            Butterfly
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
=======
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 w-full z-50 py-8">
      <nav className="max-w-[1400px] mx-auto px-6 grid grid-cols-3 items-center">
        {/* Left Navigation */}
        <div className="flex items-center gap-8">
          {navigation.slice(0, 2).map((item) => (
>>>>>>> butterfly
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
<<<<<<< HEAD

          {/* Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">
                    Orders
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
=======
>>>>>>> butterfly
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
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    Welcome, {user.name}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link href="/orders">Orders</Link>
                  </Button>
                  {user.role === 'admin' && (
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
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
