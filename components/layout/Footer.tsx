"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, Twitter, Facebook } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (isAuthPage) {
    return null
  }

  // Collection of stable SVG logos
  const paymentMethods = [
    { name: 'Visa', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg' },
    { name: 'Mastercard', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg' },
    { name: 'Amex', src: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg' },
    { name: 'PayPal', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
    { name: 'Apple Pay', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg' },
    { name: 'Google Pay', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg' },
  ]

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Top Section: Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Left Column: Brand Statement */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-8">
              <p className="text-lg md:text-xl font-light leading-relaxed text-gray-200 max-w-md">
                Butterfly is a premier contemporary label that aims at <span className="italic font-serif">reinterpreting</span> global heritage and artisanship.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-6">
                <Link href="#" className="hover:text-gray-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="hover:text-gray-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="hover:text-gray-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Right Columns: Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-medium text-xs mb-6 uppercase tracking-widest text-white">About</h3>
              <ul className="space-y-4">
                {['About Us', 'Press', 'Lookbook', 'Our Story'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-xs mb-6 uppercase tracking-widest text-white">Get in Touch</h3>
              <ul className="space-y-4">
                {['Contact', 'Returns', 'Shipping', 'Terms'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-xs mb-6 uppercase tracking-widest text-white">Join Us</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
                    Enclave
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Payments */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-end gap-8 pt-8 border-t border-white/10">
          
          <div className="space-y-4 text-xs text-gray-500">
            <p className="uppercase tracking-wider text-white mb-2">USD / EN</p>
            <p>Copyright © 2026, Butterfly. All rights reserved. <br className="md:hidden"/> See our terms of use and privacy notice.</p>
          </div>

          {/* Payment Icons */}
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <div 
                key={method.name} 
                className="bg-white px-2 py-1 rounded w-10 h-6 flex items-center justify-center overflow-hidden"
              >
                 {/* Using standard img tag for simplicity with external URLs */}
                 <img 
                   src={method.src} 
                   alt={method.name} 
                   className="w-full h-full object-contain"
                 />
              </div>
            ))}
          </div>

        </div>
      </div>
    </footer>
  )
}