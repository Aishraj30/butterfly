'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  LogOut,
  Sparkles,
  Layers,
  Clipboard,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: '150' },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: Clipboard },
  { label: 'Collections', href: '/admin/collections', icon: Layers },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Income', href: '/admin/income', icon: TrendingUp },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { isOpen, setIsOpen, toggle } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
  }

  if (!mounted) return null

  return (
    <>
      {/* Mobile Toggle - Now works with global state */}
      <motion.button
        initial={false}
        animate={{ scale: isOpen ? 0.9 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className="fixed top-4 left-4 z-[110] p-3 bg-black text-white rounded-full shadow-lg"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 3D Sidebar - Sits behind the pusher */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -50,
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.95,
          rotateY: isOpen ? 0 : 20
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 200
        }}
        className="fixed left-0 top-0 h-screen w-[300px] bg-[#050505] text-white overflow-hidden flex flex-col z-40 p-4"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Header with Glassmorphism */}
        <div className="p-6 mb-4">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D7C69D] to-[#F7E6CA] rounded-xl blur opacity-25"></div>
              <div className="relative w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                <Sparkles size={20} className="text-[#D7C69D]" />
              </div>
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-widest uppercase text-white leading-tight">
                Butterfly<br />Couture
              </h1>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1 custom-scrollbar px-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
            return (
              <motion.div
                key={item.href}
                animate={{ x: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0 }}
                transition={{ delay: isOpen ? 0.1 + index * 0.05 : 0 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className="relative flex items-center gap-4 z-10">
                    <Icon size={18} className={isActive ? 'text-black' : 'text-gray-500 group-hover:text-white'} />
                    <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            )
          })}

          <div className="h-px bg-white/5 my-6 mx-4"></div>

          <div className="space-y-1">
            {[
              { label: 'Settings', href: '/admin/settings', icon: Settings },
              { label: 'Help & Privacy', href: '/admin/help', icon: HelpCircle }
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <item.icon size={18} className="text-gray-500 group-hover:text-white" />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left text-red-400/70 hover:text-red-400 hover:bg-red-500/5"
            >
              <LogOut size={18} />
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="mt-auto p-4 border-t border-white/5">
          <ThemeToggle />
        </div>
      </motion.aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </>
  )
}
