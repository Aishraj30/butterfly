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
    <footer className="bg-black text-white pt-8 md:pt-16 pb-8 border-t border-white/5 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">

        {/* Mobile View: Accordion Navigation */}
        <div className="block md:hidden mb-8">
          <div className="space-y-4 mb-8">
            <p className="text-sm font-light leading-relaxed text-gray-200">
              Butterfly is a premier contemporary label that aims at <span className="italic font-serif">reinterpreting</span> global heritage.
            </p>
            {/* Social Icons - Mobile */}
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10">
            {[
              { title: 'About', links: [
                { name: 'About Us', href: '/about-us' },
                { name: 'Press', href: '/press' },
                { name: 'Lookbook', href: '/lookbook' },
                { name: 'Our Story', href: '/our-story' }
              ]},
              { title: 'Get in Touch', links: [
                { name: 'Contact', href: '/contact-us' },
                { name: 'Returns', href: '/returns' },
                { name: 'Refund Policy', href: '/refund-policy' },
                { name: 'Shipping', href: '/shipping' },
                { name: 'Terms', href: '/terms-and-conditions' }
              ]},
              { title: 'Join Us', links: [
                { name: 'Enclave', href: '/enclave' }
              ]}
            ].map((section) => (
              <details key={section.title} className="group border-b border-white/10">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none py-3 text-sm uppercase tracking-widest text-white">
                  {section.title}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 mt-2 mb-4 group-open:animate-fadeIn">
                  <ul className="space-y-2 pl-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="block text-xs uppercase tracking-wide hover:text-white">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Desktop View: Grid Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-8">
              <p className="text-lg md:text-xl font-light leading-relaxed text-gray-200 max-w-md">
                Butterfly is a premier contemporary label that aims at <span className="italic font-serif">reinterpreting</span> global heritage and artisanship.
              </p>
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
          <div className="lg:col-span-6 grid grid-cols-3 gap-10">
            {[
              { title: 'About', links: [
                { name: 'About Us', href: '/about-us' },
                { name: 'Press', href: '/press' },
                { name: 'Lookbook', href: '/lookbook' },
                { name: 'Our Story', href: '/our-story' }
              ]},
              { title: 'Get in Touch', links: [
                { name: 'Contact', href: '/contact-us' },
                { name: 'Returns', href: '/returns' },
                { name: 'Refund Policy', href: '/refund-policy' },
                { name: 'Shipping', href: '/shipping' },
                { name: 'Terms', href: '/terms-and-conditions' }
              ]},
              { title: 'Join Us', links: [
                { name: 'Enclave', href: '/enclave' }
              ]}
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-medium text-xs mb-6 uppercase tracking-widest text-white">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Copyright & Payments */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-end gap-6 pt-6 border-t border-white/10">
          <div className="space-y-2 text-[10px] md:text-xs text-center md:text-left text-gray-500 w-full md:w-auto">
            <p>Copyright © 2026, Butterfly. All rights reserved. <br className="hidden md:block" /> 
              <Link href="/privacy-policy" className="underline hover:text-white transition-colors">Privacy Policy</Link> • 
              <Link href="/terms-and-conditions" className="underline hover:text-white transition-colors">Terms of Use</Link>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="bg-white px-1.5 py-0.5 md:px-2 md:py-1 rounded w-8 h-5 md:w-10 md:h-6 flex items-center justify-center overflow-hidden"
              >
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