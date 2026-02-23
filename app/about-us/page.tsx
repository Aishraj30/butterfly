'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight, Scissors, Leaf, Clock } from 'lucide-react'

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-stone-800 selection:bg-stone-200">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Placeholder image - replace with your actual brand image */}
        <div 
          className="absolute inset-0 bg-[url('/pic1.jpg')] bg-cover bg-center bg-no-repeat"
        />
        <div className="absolute inset-0 bg-stone-900/40" /> {/* Dark overlay for text readability */}
        
        <div className="relative z-10 text-center space-y-4 px-6">
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-widest uppercase">
            About Us
          </h1>
          <p className="text-lg md:text-xl font-light text-stone-200 tracking-[0.2em] uppercase">
            The Art of Metamorphosis
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif mb-16 text-center text-stone-900">Our Philosophy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center mb-4">
                <Scissors className="w-6 h-6 text-stone-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif text-stone-900">Artistry & Craftsmanship</h3>
              <p className="text-stone-600 font-light leading-relaxed">
                Every garment is a canvas where traditional techniques meet contemporary design. We work with master artisans who share our passion for perfection.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-stone-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif text-stone-900">Sustainability</h3>
              <p className="text-stone-600 font-light leading-relaxed">
                We are committed to responsible fashion. From ethical sourcing to sustainable production, every step respects our planet and its people.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-stone-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif text-stone-900">Timeless Design</h3>
              <p className="text-stone-600 font-light leading-relaxed">
                While trends come and go, true style is eternal. We create pieces that you will cherish today and treasure tomorrow, transcending seasonal fads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Links Split Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-stone-900 border-b border-stone-200 pb-4">Visit Us</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-stone-50 rounded-full group-hover:bg-stone-100 transition-colors">
                  <MapPin className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h4 className="text-sm tracking-wider uppercase text-stone-500 mb-1">Headquarters</h4>
                  <p className="text-stone-900">123 Fashion Avenue<br />New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-stone-50 rounded-full group-hover:bg-stone-100 transition-colors">
                  <Mail className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h4 className="text-sm tracking-wider uppercase text-stone-500 mb-1">Inquiries</h4>
                  <p className="text-stone-900 hover:text-stone-500 transition-colors cursor-pointer">
                    hello@butterflycouture.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-stone-50 rounded-full group-hover:bg-stone-100 transition-colors">
                  <Phone className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h4 className="text-sm tracking-wider uppercase text-stone-500 mb-1">Direct Line</h4>
                  <p className="text-stone-900">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}