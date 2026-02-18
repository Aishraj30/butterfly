'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

interface BackToHomeButtonProps {
  className?: string
  variant?: 'default' | 'minimal' | 'elegant'
}

export function BackToHomeButton({ className = "", variant = 'default' }: BackToHomeButtonProps) {
  const baseClasses = "inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg transition-all duration-200 font-medium text-sm md:text-base"
  
  const variantClasses = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300",
    minimal: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
    elegant: "bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 shadow-sm border border-gray-200"
  }

  return (
    <Link 
      href="/" 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <ArrowLeft size={14} className="md:size={16}" />
      {variant !== 'elegant' && (
        <>
          <Home size={14} className="md:size={16}" />
          <span className="hidden sm:inline">Back to Home</span>
        </>
      )}
    </Link>
  )
}
