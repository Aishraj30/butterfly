'use client'

import Link from 'next/link'
import { ArrowLeft, Heart, Sparkles } from 'lucide-react'

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <h1 className="text-xl font-light tracking-wider">OUR STORY</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-[1400px] mx-auto px-6 h-full flex items-center">
          <div className="text-center text-white max-w-3xl">
            <div className="mb-6">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
              Where Artistry
              <br />
              Meets
              <br />
              Innovation
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              The story of Butterfly Couture begins with a simple belief: fashion should be both beautiful and meaningful.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* The Beginning */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-6">The Beginning</h2>
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed text-lg">
                Butterfly Couture was born from a dream to redefine luxury fashion through the lens of sustainability and artistry. 
                Our founder, a third-generation designer, grew up surrounded by the rich traditions of couture craftsmanship.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                In 2018, with a small workshop and a big vision, we set out to create pieces that would not only 
                make people look beautiful, but feel beautiful about their choices.
              </p>
            </div>
          </section>

          {/* Our Philosophy */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-6">Our Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3">Passion</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every stitch tells a story of dedication and love for the craft
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3">Innovation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pushing boundaries while respecting timeless traditions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🌍</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Sustainability</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Creating beauty that doesn't cost the earth
                </p>
              </div>
            </div>
          </section>

          {/* The Butterfly Symbol */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-6">Why Butterfly?</h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl">🦋</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    The butterfly represents transformation, beauty, and the delicate balance between strength and grace. 
                    These are the very qualities we embed in every piece we create.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Just as a butterfly undergoes metamorphosis to become something extraordinary, 
                    we believe fashion has the power to transform not just how you look, but how you feel.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Journey */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-6">Our Journey</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2018
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">The Dream</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Started in a small workshop with a handful of dedicated artisans who shared our vision.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2020
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">First Collection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Launched our debut collection featuring 12 handcrafted pieces that sold out within weeks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2022
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">International Recognition</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Featured in major fashion weeks and received our first sustainability award.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2024
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Global Expansion</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Opened flagship stores in New York, Paris, and Tokyo while maintaining our commitment to sustainable practices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gray-300 text-black rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2026
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">The Future</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Continuing our mission to redefine luxury fashion through innovation, inclusivity, and environmental responsibility.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black text-white p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Artisan Excellence</h3>
                <p className="text-gray-300 leading-relaxed">
                  We partner with master craftspeople who share our commitment to perfection. Every piece is a work of art.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Ethical Sourcing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every material is sourced responsibly, ensuring fair wages and safe working conditions for all involved in our supply chain.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Environmental Stewardship</h3>
                <p className="text-gray-600 leading-relaxed">
                  We're committed to reducing our environmental footprint through sustainable materials and responsible production methods.
                </p>
              </div>

              <div className="bg-black text-white p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Customer Experience</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our relationship with you extends beyond the purchase. We're here to ensure every experience with Butterfly Couture is exceptional.
                </p>
              </div>
            </div>
          </section>

          {/* Join Our Story */}
          <div className="bg-black text-white p-8 rounded-lg mt-12">
            <h3 className="text-xl font-light mb-4 text-center">Be Part of Our Story</h3>
            <p className="text-gray-300 mb-6 text-center">
              Butterfly Couture is more than a brand—it's a community of dreamers, creators, and lovers of beautiful things.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us" className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                Share Your Story
              </Link>
              <Link href="/lookbook" className="border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
