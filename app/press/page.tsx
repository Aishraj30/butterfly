'use client'

import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'

// Mock data for the lookbook collections
const collections = [
  {
    id: 1,
    title: 'The Chrysalis Collection',
    season: 'Autumn/Winter 2026',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop',
    size: 'large', // to control grid spanning
  },
  {
    id: 2,
    title: 'Midnight Monarch',
    season: 'Evening Wear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1962&auto=format&fit=crop',
    size: 'small',
  },
  {
    id: 3,
    title: 'Silk & Stone',
    season: 'Resort 2026',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop',
    size: 'small',
  },
  {
    id: 4,
    title: 'Ethereal Armor',
    season: 'Spring/Summer 2026',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=1998&auto=format&fit=crop',
    size: 'large',
  },
]

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 selection:bg-stone-200 pb-24">
      
      {/* Minimalist Navigation */}
      <nav className="absolute top-0 left-0 w-full p-6 z-20 flex justify-center mix-blend-difference text-white">
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-6 uppercase tracking-wider">
          Campaigns
        </h1>
        <p className="text-lg md:text-xl font-light text-stone-500 tracking-wide">
          Explore the visual narratives behind our latest collections. A study in form, fabric, and metamorphosis.
        </p>
      </section>

      {/* Featured Video/Hero Image Banner */}
      <section className="px-6 max-w-[1400px] mx-auto mb-24">
        <div className="relative aspect-video w-full overflow-hidden bg-stone-900 group cursor-pointer">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-80 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-sm tracking-[0.2em] uppercase mb-2">Behind the Scenes</p>
            <h2 className="text-3xl font-serif">The Making of Chrysalis</h2>
          </div>
        </div>
      </section>

      {/* Editorial Grid */}
      <section className="px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {collections.map((item, index) => (
            <div 
              key={item.id} 
              className={`group relative overflow-hidden bg-stone-200 cursor-pointer ${
                item.size === 'large' ? 'aspect-[3/4] md:aspect-square' : 'aspect-[3/4]'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-stone-300 text-sm uppercase tracking-widest mb-2">
                  {item.season}
                </p>
                <h3 className="text-white text-3xl font-serif">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}