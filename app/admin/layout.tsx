'use client'

import React from "react"
import { AuthProvider } from '@/contexts/AuthContext'
import { ChatBot } from '@/components/chat/ChatBot'
import { Analytics } from '@vercel/analytics/next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1">
        {children}
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
