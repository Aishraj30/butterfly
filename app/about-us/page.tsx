'use client'

import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-center">
          <h1 className="text-2xl font-light tracking-wide text-gray-900">ABOUT US</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-light tracking-wide mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Butterfly Couture was founded with a singular vision: to create exquisite fashion that transcends time and trends. 
                Our journey began in the heart of the fashion world, where artistry meets innovation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe that fashion is not just about clothing—it's about self-expression, confidence, and the 
                art of presenting oneself to the world. Each piece in our collection tells a story, 
                crafted with meticulous attention to detail and an unwavering commitment to quality.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our name, Butterfly, symbolizes transformation, beauty, and the delicate balance between strength 
                and grace—qualities we embed in every creation.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-light tracking-wide mb-4">Our Philosophy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Artistry & Craftsmanship</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every garment is a canvas where traditional techniques meet contemporary design. 
                    We work with master artisans who share our passion for perfection.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Sustainability</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We are committed to responsible fashion. From ethical sourcing to sustainable production, 
                    every step of our process is designed with respect for our planet and its people.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Timeless Design</h3>
                  <p className="text-gray-600 leading-relaxed">
                    While trends come and go, true style is eternal. We create pieces that you'll 
                    cherish today and treasure tomorrow, transcending seasonal fads.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-gray-600">hello@butterflycouture.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Headquarters</p>
                    <p className="text-gray-600">123 Fashion Avenue<br />New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/contact-us" className="block hover:opacity-80 transition-opacity">
                  Contact Us →
                </Link>
                <Link href="/lookbook" className="block hover:opacity-80 transition-opacity">
                  Lookbook →
                </Link>
                <Link href="/careers" className="block hover:opacity-80 transition-opacity">
                  Careers →
                </Link>
                <Link href="/press" className="block hover:opacity-80 transition-opacity">
                  Press →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
