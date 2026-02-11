'use client'

import React from "react"
import { AuthProvider } from '@/contexts/AuthContext'
import { ChatBot } from '@/components/chat/ChatBot'
import { Analytics } from '@vercel/analytics/next'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { motion, AnimatePresence } from 'framer-motion'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* 3D Perspective Container */}
      <div
        className="perspective-container h-full w-full"
        style={{ perspective: '1500px', perspectiveOrigin: '0% 50%' }}
      >
        <AdminSidebar />

        {/* The 3D Pusher (Main Content) */}
        <motion.div
          animate={{
            translateX: isOpen ? 300 : 0,
            rotateY: isOpen ? -15 : 0,
            scale: isOpen ? 0.9 : 1,
            borderRadius: isOpen ? '40px' : '0px'
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200
          }}
          className="relative min-h-screen bg-[#F7E6CA] dark:bg-[#0a0a0a] shadow-2xl overflow-hidden z-[45] origin-left"
        >
          {children}

          {/* Overlay to close sidebar on click */}
          {isOpen && (
            <div
              className="absolute inset-0 z-[100] cursor-pointer"
              onClick={() => { }} // This will be handled by clicking the pusher if we want, or we keep it as is
            />
          )}
        </motion.div>
      </div>

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
      <SidebarProvider>
        <AdminLayoutContent>
          {children}
        </AdminLayoutContent>
      </SidebarProvider>
    </AuthProvider>
  )
}
