'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  User,
  ShoppingCart,
  ChevronDown,
  Heart,
  Search,
  LogOut,
  Menu,
  X,
  ShoppingBag
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CartDrawer } from './CartDrawer'

const navigation = [
  { name: 'Catalog', href: '/catalog', hasDropdown: true },
  { name: 'Sale', href: '/sale' },
  { name: 'New Arrival', href: '/new-arrival' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Header style based on page and scroll
  const headerBg = isScrolled || !isHome ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
  const textColor = isScrolled || !isHome ? 'text-black' : 'text-white'
  const logoColor = isScrolled || !isHome ? 'text-black' : 'text-white'

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg} ${isScrolled || !isHome ? 'py-4' : 'py-8'}`}>
      <nav className="max-w-[1400px] mx-auto px-6 grid grid-cols-3 items-center">
        {/* Left Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.slice(0, 2).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-1 text-[13px] font-bold uppercase tracking-[0.2em] transition-colors ${textColor} hover:opacity-70`}
            >
              {item.name}
              {item.hasDropdown && <ChevronDown size={12} className="mt-[2px] opacity-70" />}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle (Left on Mobile) */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 ${textColor}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex-shrink-0">
            <span className={`font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.9em] italic whitespace-nowrap transition-colors ${logoColor}`}>
              BUTTERFLY
            </span>
          </Link>
        </div>

        {/* Right Navigation & Actions */}
        <div className="flex items-center justify-end gap-4 md:gap-8">
          {/* Desktop Links (Right half) */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.slice(2).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[13px] font-bold uppercase tracking-[0.2em] transition-colors ${textColor} hover:opacity-70`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className={`flex items-center gap-3 md:gap-6 transition-colors ${textColor}`}>
            <button className="hover:opacity-70 transition-opacity hidden sm:block">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href="/wishlist" className="hover:opacity-70 transition-opacity hidden sm:block">
              <Heart size={20} strokeWidth={1.5} />
            </Link>

            {/* Auth/Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:opacity-70 transition-opacity flex items-center gap-1">
                  <User size={20} strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-4">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium border-b mb-1">
                      Hi, {user.name}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer w-full">Orders</Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer w-full text-blue-600 font-medium">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer w-full">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="cursor-pointer w-full">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center hover:opacity-70 transition-opacity cursor-pointer relative"
              aria-label="Open Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden flex flex-col p-8 pt-24 space-y-6 overflow-y-auto">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-6 text-black"
          >
            <X size={32} />
          </button>

          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-black tracking-widest uppercase border-b border-black/10 pb-4"
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-8 space-y-4">
            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-black/70 text-lg">
              <Heart size={20} /> Wishlist
            </Link>
            <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-black/70 text-lg">
              <Search size={20} /> Search
            </Link>

            <div className="pt-4 border-t border-black/10">
              {user ? (
                <div className="space-y-4">
                  <p className="text-black/50 text-sm">Logged in as {user.name}</p>
                  <button onClick={logout} className="text-red-500 text-lg flex items-center gap-2">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#CDA45D] text-white py-4 text-center font-bold tracking-widest">LOGIN</Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="border border-black/20 text-black py-4 text-center font-bold tracking-widest">SIGN UP</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
