'use client'

import { Search, Bell, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-white border-b border-[#D7C69D]/30 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold text-[#003300]">
            Good Morning, Administrator
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7E6CA]/50 border border-[#D7C69D]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7C69D] focus:border-transparent text-[#003300] placeholder-gray-500"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-[#F7E6CA]/50 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D7C69D] to-[#F7E6CA] rounded-full flex items-center justify-center border border-[#D7C69D]/20">
              <User size={20} className="text-[#003300]" />
            </div>
            <ChevronDown size={16} className="text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  )
}
