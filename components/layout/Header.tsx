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
import { CatalogDrawer } from './CatalogDrawer'
import { FeaturedDrawer } from './FeaturedDrawer'

interface Collection {
  id: number
  name: string
  description?: string
  categories?: string[]
  productCount?: number
}

const navigation = [
  { name: 'Catalog', href: '/catalog', hasDropdown: true },
  { name: 'Featured', href: '/featured', hasDropdown: true },
  { name: 'New Arrival', href: '/new-arrival' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCatalogHovered, setIsCatalogHovered] = useState(false)
  const [isCatalogDrawerOpen, setIsCatalogDrawerOpen] = useState(false)
  const [isFeaturedDrawerOpen, setIsFeaturedDrawerOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    // Fetch collections
    fetch('/api/collections')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCollections(data.data)
        }
      })
      .catch(error => console.error('Failed to fetch collections:', error))
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/catalog/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isHome = pathname === '/'
  const isCatalog = pathname === '/catalog'
  const isAdmin = pathname.startsWith('/admin')

  if (isAuthPage || isAdmin) {
    return null
  }

  // Header style - transparent on home, white on other pages
  const headerBg = isHome && !isCatalog ? 'bg-transparent' : 'bg-white shadow-sm'
  const textColor = isHome && !isCatalog ? 'text-white' : 'text-black'
  const logoColor = isHome && !isCatalog ? 'text-white' : 'text-black'

  return (
    <header className={`relative w-full z-50 transition-all duration-300 ${headerBg} py-8`}>
      <nav className="max-w-[1400px] mx-auto px-2 py-1 grid grid-cols-3 items-center">
        {/* Left Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.slice(0, 2).map((item) => (
            <Link
              key={item.name}
              href={item.hasDropdown ? '#' : item.href}
              onClick={item.hasDropdown ? (e) => {
                e.preventDefault()
                if (item.name === 'Catalog') {
                  setIsCatalogDrawerOpen(true)
                } else if (item.name === 'Featured') {
                  setIsFeaturedDrawerOpen(true)
                }
              } : undefined}
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                pathname === item.href ? textColor : (isHome && !isCatalog ? 'text-white/90' : 'text-gray-900')
              }`}
            >
              {item.name}
              {item.hasDropdown && <ChevronDown size={12} className="mt-[2px] opacity-70" />}
            </Link>
                } : undefined}
                className={`text-sm font-semibold transition-all flex items-center gap-1 ${pathname === item.href ? 'text-white' : isHome && !isCatalog ? 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : 'text-gray-600'
                  } hover:text-white`}
              >
                {item.name}
                {item.hasDropdown && <ChevronDown size={12} className="mt-[2px] opacity-70" />}
              </Link>
            </div>
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
        <div className="flex justify-center items-center">
          <Link href="/" className="flex-shrink-0">
            <span className={`font-sans text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-[0.2em] whitespace-nowrap transition-all ${logoColor} ${!isHome || isCatalog ? '' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'}`}>
              BUTTERFLY
            </span>
          </Link>
        </div>

        {/* Right Navigation & Actions */}
        <div className="flex items-center justify-end gap-4 md:gap-8">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.slice(2).map((item) => (
              <Link
                key={item.name}
                href={item.hasDropdown ? '#' : item.href}
                onClick={item.hasDropdown ? (e) => {
                  e.preventDefault()
                  if (item.name === 'Featured') {
                    setIsFeaturedDrawerOpen(true)
                  }
                } : undefined}
                className={`text-sm font-medium transition-colors hover:${isHome && !isCatalog ? 'text-white' : 'text-black'} ${
                  pathname === item.href ? textColor : (isHome && !isCatalog ? 'text-white/90' : 'text-gray-900')
                }`}
                href={item.href}
                className={`text-sm font-semibold transition-all hover:opacity-100 ${pathname === item.href ? 'text-white' : isHome && !isCatalog ? 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : 'text-gray-600'
                  } hover:text-white`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className={`flex items-center gap-3 md:gap-6 transition-colors ${textColor}`}>
            {/* Search Bar */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50">
                  <div className="relative w-full px-4 pt-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="SEARCH"
                        className="w-full py-4 px-4 border-b-2 border-gray-400 focus:outline-none text-lg text-black bg-transparent"
                        autoFocus
                      />
                      <button
                        onClick={() => setIsSearchOpen(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hover:opacity-70 transition-opacity flex items-center"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>
            <Link href="/wishlist" className="hover:opacity-70 transition-opacity hidden sm:flex items-center">
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
            <div key={item.name}>
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-black tracking-widest uppercase border-b border-black/10 pb-4 block"
              >
                {item.name}
              </Link>
              {item.hasDropdown && collections.length > 0 && (
                <div className="pl-6 pt-4 space-y-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/catalog?collection=${collection.name}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-sm text-black/60 py-2 hover:text-black transition-colors"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
      <CatalogDrawer isOpen={isCatalogDrawerOpen} onClose={() => setIsCatalogDrawerOpen(false)} />
      <FeaturedDrawer isOpen={isFeaturedDrawerOpen} onClose={() => setIsFeaturedDrawerOpen(false)} />
    </header>
  )
}
