"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (isAuthPage) {
    return null
  }

  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/20 pb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="text-4xl font-medium tracking-wide text-white">BUTTERFLY</h2>
            <div className="space-y-1 text-sm text-white/80">
              <p>Address: 123 Fashion Street, Paris</p>
              <p>Phone: +1 234 567 890</p>
              <p>Email: info@butterflycouture.com</p>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Menu</h3>
            <ul className="space-y-3">
              {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Help</h3>
            <ul className="space-y-3">
              {['Shipping', 'Returns', 'Sizing', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Social</h3>
            <ul className="space-y-3">
              {['Instagram', 'Facebook', 'Twitter', 'Pinterest'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center text-sm text-white/60">
          © 2024 Butterfly Couture. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
