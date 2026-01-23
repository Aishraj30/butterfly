import React from "react"
import { AuthProvider } from '@/contexts/AuthContext'
import { ChatBot } from '@/components/chat/ChatBot'
import { Analytics } from '@vercel/analytics/next'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      {children}
      <ChatBot />
      <Analytics />
    </AuthProvider>
  )
}
