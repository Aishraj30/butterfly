import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import SmoothScroll from '@/components/SmoothScroll'
import { ChatBot } from '@/components/chat/ChatBot'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a1a',
}

export const metadata: Metadata = {
  title: 'Butterfly Couture | Luxury Fashion',
  description: 'Discover exquisite butterfly-inspired luxury fashion collection. Premium couture pieces crafted with elegance and sophistication.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <SmoothScroll />
        <Header />
        {children}
        <Footer />
        <ChatBot />
        <Analytics />
      </body>
    </html>
  )
}
