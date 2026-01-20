import Link from 'next/link'
import { Mail, Instagram, Facebook, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold">Butterfly</h2>
            <p className="text-sm text-primary-foreground/80">
              Luxury fashion redefined. Where elegance meets innovation.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Shop</h3>
            <ul className="space-y-3">
              {['New Arrivals', 'Best Sellers', 'Collections', 'Sale'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Blog', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-3">
              {['Contact Us', 'Shipping Info', 'Returns', 'Sizing Guide'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-primary-foreground/20 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-sm mb-3">Subscribe to Our Newsletter</h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-primary-foreground text-primary text-sm rounded-sm placeholder:text-primary/50 focus:outline-none focus:ring-1 focus:ring-primary-foreground"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-background text-primary font-medium text-sm rounded-sm hover:bg-primary-foreground/10 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/60">
            © 2024 Butterfly Couture. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4">
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Instagram size={16} />
            </Link>
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Facebook size={16} />
            </Link>
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Twitter size={16} />
            </Link>
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Mail size={16} />
            </Link>
          </div>

          {/* Policies */}
          <div className="flex gap-4 text-xs">
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
