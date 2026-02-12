'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
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
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

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
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-primary text-primary-foreground rounded-sm"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 overflow-y-auto lg:static lg:translate-x-0 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D7C69D] to-[#F7E6CA] rounded-lg flex items-center justify-center border border-[#D7C69D]/20">
              <Sparkles size={20} className="text-[#003300]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#003300]">Butterfly-Couture</h1>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-[#F7E6CA] text-[#003300] border border-[#D7C69D]/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-[#F7E6CA]/50 hover:text-[#003300]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          {/* Other Menu Items */}
          <Link
            href="/admin/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-[#F7E6CA]/50 hover:text-[#003300]"
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>

          <Link
            href="/admin/help"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-[#F7E6CA]/50 hover:text-[#003300]"
          >
            <HelpCircle size={20} />
            <span className="font-medium">Help & Privacy</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left text-gray-600 dark:text-gray-300 hover:bg-[#F7E6CA]/50 hover:text-[#003300]"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
