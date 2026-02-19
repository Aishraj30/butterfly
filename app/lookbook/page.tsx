'use client'

import Link from 'next/link'
import { ArrowLeft, Play, ArrowUpRight } from 'lucide-react'

// Mock data for the lookbook collections
const collections = [
  {
    id: 1,
    title: 'The Chrysalis Collection',
    season: 'Autumn/Winter 2026',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop',
    layout: 'col-span-1 lg:col-span-7 aspect-[4/5] lg:aspect-[16/10]',
  },
  {
    id: 2,
    title: 'Midnight Monarch',
    season: 'Evening Wear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1962&auto=format&fit=crop',
    layout: 'col-span-1 lg:col-span-5 aspect-[3/4] lg:mt-40',
  },
  {
    id: 3,
    title: 'Silk & Stone',
    season: 'Resort 2026',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop',
    layout: 'col-span-1 lg:col-span-5 aspect-[3/4]',
  },
  {
    id: 4,
    title: 'Ethereal Armor',
    season: 'Spring/Summer 2026',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=1998&auto=format&fit=crop',
    layout: 'col-span-1 lg:col-span-7 aspect-[4/5] lg:aspect-[16/10] lg:-mt-32',
  },
]

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-50 selection:bg-stone-700 font-light">
      
      {/* Immersive Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 lg:px-12 z-50 flex justify-between items-center mix-blend-difference">
        <Link 
          href="/about-us" 
          className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white hover:opacity-60 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> Return
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] text-white">Archives & Campaigns</span>
      </nav>

      {/* Cinematic Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video/Image Substitute */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-40 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
        
        <div className="relative z-10 text-center flex flex-col items-center mt-20">
          <p className="text-xs tracking-[0.4em] uppercase text-stone-300 mb-6">Maison Butterfly</p>
          <h1 className="text-7xl md:text-[9rem] font-serif text-white tracking-tight leading-none mb-8">
            LOOKBOOK
          </h1>
          <button className="flex items-center gap-3 border border-white/30 rounded-full px-6 py-3 hover:bg-white hover:text-black transition-all duration-500 group backdrop-blur-sm">
            <Play className="w-4 h-4 fill-current" />
            <span className="text-xs uppercase tracking-[0.2em]">Play Campaign</span>
          </button>
        </div>
      </section>

      {/* Asymmetrical Masonry Grid */}
      <section className="px-6 lg:px-12 max-w-[1800px] mx-auto py-24 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {collections.map((item, index) => (
            <div 
              key={item.id} 
              className={`group relative overflow-hidden bg-stone-900 cursor-pointer ${item.layout}`}
            >
              {/* Image with slow zoom on hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              
              {/* Dark overlay that fades in from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
              
              {/* Content floating at the bottom */}
              <div className="absolute bottom-0 left-0 w-full p-8 lg:p-12 flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-serif italic text-stone-400">0{index + 1}</span>
                    <div className="h-[1px] w-8 bg-stone-500" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-300">
                      {item.season}
                    </p>
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-serif text-white">
                    {item.title}
                  </h3>
                </div>
                
                {/* Arrow indicator */}
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Minimalist Footer / CTA */}
      <section className="border-t border-stone-800/50 pt-32 pb-24 text-center px-6">
        <h2 className="text-4xl lg:text-5xl font-serif text-white mb-12">The Atelier Awaits</h2>
        <Link 
          href="/contact-us" 
          className="group inline-flex items-center gap-6 pb-4 border-b border-stone-700 hover:border-white transition-colors duration-500"
        >
          <span className="text-sm tracking-[0.2em] uppercase text-stone-300 group-hover:text-white transition-colors">
            Request a Private Viewing
          </span>
          <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />
        </Link>
      </section>

    </div>
  )
}