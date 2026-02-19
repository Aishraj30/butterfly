'use client'

import Link from 'next/link'
import { Search, Bell, User, ChevronDown, Home } from 'lucide-react'
import { useState } from 'react'

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700 px-6 py-4 pl-14 lg:pl-6 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-4">
        {/* Back to Home Button */}
        <Link href="/" className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-black dark:text-white">
          <Home size={18} />
          <span className="hidden sm:inline font-medium">Back to Home</span>
        </Link>

        {/* Greeting */}
        <div className="flex-1">
          <h1 className="text-lg lg:text-2xl font-semibold text-black dark:text-white">
            <span className="hidden sm:inline">Good Morning, </span>Administrator
          </h1>
        </div>

        {/* Search Bar - Hidden on Mobile */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search Icon Mobile */}
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-black dark:bg-white rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600">
              <User size={18} className="text-white dark:text-black" />
            </div>
            <ChevronDown size={16} className="text-gray-600 dark:text-gray-400 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  )
}
