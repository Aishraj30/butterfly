'use client'

import React from "react"
import { AuthProvider } from '@/contexts/AuthContext'
import { ChatBot } from '@/components/chat/ChatBot'
import { Analytics } from '@vercel/analytics/next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white dark:bg-black" data-lenis-prevent="true">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>

      <ChatBot />
      <Analytics />
    </div>
  )
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AuthProvider>
  )
}
