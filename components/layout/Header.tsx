'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  Package
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CartDrawer } from './CartDrawer'
import { CatalogDrawer } from './CatalogDrawer'
import { UserDropdown } from './UserDropdown'
import { FeaturedDrawer } from './FeaturedDrawer'
import { useCart } from '@/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'

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
]

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['catalog', 'featured'])
  const [isCatalogHovered, setIsCatalogHovered] = useState(false)
  const [isCatalogDrawerOpen, setIsCatalogDrawerOpen] = useState(false)
  const [isFeaturedDrawerOpen, setIsFeaturedDrawerOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { cart } = useCart()

  useEffect(() => {
    // Fetch collections
    fetch('/api/collections')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCollections(data.collections || [])
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

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      fetch(`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSearchSuggestions(data.products || []);
          }
        })
        .catch(error => console.error('Failed to fetch suggestions:', error))
        .finally(() => setIsSearching(false));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isHome = pathname === '/'
  const isCatalog = pathname === '/catalog'
  const isAdmin = pathname.startsWith('/admin')
  const isProductPage = pathname.startsWith('/product/')

  if (isAuthPage || isAdmin) {
    return null
  }

  // Header style - transparent on home, black gradient on product pages, white on other pages
  const headerBg = isHome && !isCatalog ? 'bg-transparent' : isProductPage ? 'bg-gradient-to-b from-black/40 to-transparent' : 'bg-white shadow-sm'
  const textColor = isHome && !isCatalog ? 'text-white' : isProductPage ? 'text-white' : 'text-black'
  const logoColor = isHome && !isCatalog ? 'text-white' : isProductPage ? 'text-white' : 'text-black'

  return (
    <header
      style={{ top: isHome ? 'var(--announcement-height, 0px)' : undefined }}
      className={`w-full z-[999] transition-all duration-300 ${headerBg} py-0 ${isHome ? 'fixed left-0' : (!isProductPage ? 'sticky top-0' : '')}`}
    >
      <nav className="max-w-[1400px] mx-auto pl-2 pr-3.5 md:px-6 py-0 grid grid-cols-3 items-center">
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
              className={`text-sm font-semibold transition-all flex items-center gap-1 ${pathname === item.href ? 'text-white' : isHome && !isCatalog ? 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : isProductPage ? 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : 'text-gray-600'}`}
            >
              {item.name}
              {item.hasDropdown && <ChevronDown size={12} className="mt-[2px] opacity-70" />}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-1">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 ${textColor}`}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`p-2 ${textColor} hover:opacity-70 transition-opacity`}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center items-center pl-4 md:pl-0">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/Logo 2.png"
              alt="Butterfly Couture"
              className={`h-18 md:h-22 lg:h-26 w-auto object-contain transition-all ${!isHome || isCatalog ? '' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'}`}
            />
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
                className={`text-sm font-semibold transition-all hover:opacity-100 ${pathname === item.href ? 'text-white' : isHome && !isCatalog ? 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : 'text-gray-600'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className={`flex items-center gap-6 transition-colors ${textColor}`}>
            {/* Search Bar - Desktop Only */}
            <div className="relative hidden md:flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 px-4 pt-4"
                  >
                    <div className="relative max-w-4xl mx-auto">
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-black"
                      >
                        <X size={18} />
                      </button>

                      {/* Search Suggestions Dropdown */}
                      {searchSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                          <div className="p-2">
                            {isSearching ? (
                              <div className="text-center py-4 text-gray-600 font-sans text-sm">
                                Searching...
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {searchSuggestions.map((product, index) => (
                                  <Link
                                    key={product._id || index}
                                    href={`/product/${product._id}`}
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setSearchQuery('');
                                      setSearchSuggestions([]);
                                    }}
                                    className="block p-3 hover:bg-gray-100 rounded-md transition-colors group"
                                  >
                                    <div className="flex items-center gap-3">
                                      {product.image && (
                                        <img
                                          src={product.image}
                                          alt={product.name}
                                          className="w-10 h-10 object-cover rounded bg-gray-100"
                                        />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="text-black font-medium text-sm truncate group-hover:text-gray-700 transition-colors">
                                          {product.name}
                                        </div>
                                        <div className="text-gray-600 text-xs font-sans truncate">
                                          {product.category} • ₹{product.price}
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:opacity-70 transition-opacity flex items-center hover:cursor-pointer"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* User Icon */}
            <UserDropdown />

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center hover:opacity-70 transition-opacity cursor-pointer relative"
              aria-label="Open Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cart?.items && cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] cursor-pointer md:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-[101] h-full w-full max-w-[320px] bg-black/40 backdrop-blur-2xl border-r border-white/20 shadow-[20px_0_50px_rgba(0,0,0,0.1)] font-sans text-white md:hidden overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/20 px-6 py-6">
                <h2 className="text-xl uppercase tracking-[0.2em] text-white">
                  Menu
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group rounded-full p-2 transition-colors hover:bg-white/20 cursor-pointer bg-white/10"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-2">
                  {navigation.map((item, idx) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + idx * 0.1 }}
                      className="border-b border-white/10"
                    >
                      {item.hasDropdown ? (
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            if (item.name === 'Catalog') {
                              setIsCatalogDrawerOpen(true)
                            } else if (item.name === 'Featured') {
                              setIsFeaturedDrawerOpen(true)
                            }
                          }}
                          className="flex items-center justify-between w-full py-4 text-left group"
                        >
                          <span className="text-lg uppercase tracking-wide group-hover:text-gray-200 transition-colors">
                            {item.name}
                          </span>
                          <ChevronDown
                            size={16}
                            className="transform -rotate-90 text-white/60 group-hover:text-gray-200"
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between w-full py-4 text-left group"
                        >
                          <span className="text-lg uppercase tracking-wide group-hover:text-gray-200 transition-colors">
                            {item.name}
                          </span>
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  {/* Additional Links */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4 space-y-2 border-t border-white/10"
                  >
                    <Link
                      href="/wishlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors"
                    >
                      <Heart size={18} />
                      <span className="text-sm">Wishlist</span>
                    </Link>
                    <Link
                      href="/search"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors"
                    >
                      <Search size={18} />
                      <span className="text-sm">Search</span>
                    </Link>
                  </motion.div>

                  {/* User Section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4 space-y-2 border-t border-white/10"
                  >
                    {user ? (
                      <>
                        <Link
                          href="/orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors"
                        >
                          <Package size={18} />
                          <span className="text-sm">Orders</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block pl-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout()
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full text-left pl-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors"
                        >
                          <span className="text-sm">Login</span>
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors"
                        >
                          <span className="text-sm">Sign Up</span>
                        </Link>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CatalogDrawer isOpen={isCatalogDrawerOpen} onClose={() => setIsCatalogDrawerOpen(false)} />
      <FeaturedDrawer isOpen={isFeaturedDrawerOpen} onClose={() => setIsFeaturedDrawerOpen(false)} />
    </header>
  )
}
