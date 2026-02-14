'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, ZoomIn } from 'lucide-react'

export default function LookbookPage() {
  const [selectedSeason, setSelectedSeason] = useState('spring-2024')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const lookbookData = {
    'spring-2024': {
      title: 'Spring 2024: Renaissance',
      description: 'A celebration of rebirth and renewal, where classic silhouettes meet contemporary artistry.',
      images: [
        {
          id: 1,
          url: '/lookbook/spring-2024/1.jpg',
          title: 'Morning Bloom',
          description: 'Silk chiffon dress with hand-embroidered floral details'
        },
        {
          id: 2,
          url: '/lookbook/spring-2024/2.jpg',
          title: 'Urban Garden',
          description: 'Tailored linen suit with asymmetrical button placement'
        },
        {
          id: 3,
          url: '/lookbook/spring-2024/3.jpg',
          title: 'Butterfly Kiss',
          description: 'Organic cotton dress with hand-painted butterfly motifs'
        },
        {
          id: 4,
          url: '/lookbook/spring-2024/4.jpg',
          title: 'City Lights',
          description: 'Structured evening gown with recycled silver threadwork'
        },
        {
          id: 5,
          url: '/lookbook/spring-2024/5.jpg',
          title: 'Fresh Dew',
          description: 'Lightweight organza blouse with pearl details'
        },
        {
          id: 6,
          url: '/lookbook/spring-2024/6.jpg',
          title: 'Spring Awakening',
          description: 'High-waisted trousers with artistic pleating'
        }
      ]
    },
    'fall-2024': {
      title: 'Fall 2024: Metamorphosis',
      description: 'An exploration of transformation through rich textures and dramatic silhouettes.',
      images: [
        {
          id: 7,
          url: '/lookbook/fall-2024/1.jpg',
          title: 'Autumn Leaves',
          description: 'Wool coat with oversized collar and leather details'
        },
        {
          id: 8,
          url: '/lookbook/fall-2024/2.jpg',
          title: 'Golden Hour',
          description: 'Velvet dress with hand-beaded embellishments'
        }
      ]
    }
  }

  const currentSeason = lookbookData[selectedSeason as keyof typeof lookbookData]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <h1 className="text-xl font-light tracking-wider">LOOKBOOK</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Season Selector */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.keys(lookbookData).map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSeason === season
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-300 hover:border-gray-400'
                }`}
              >
                {lookbookData[season as keyof typeof lookbookData].title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Season Description */}
      <div className="bg-black text-white py-8">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-2xl font-light mb-4">{currentSeason.title}</h2>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {currentSeason.description}
          </p>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="py-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentSeason.images.map((image) => (
              <div key={image.id} className="group cursor-pointer" onClick={() => setSelectedImage(image.id)}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                  
                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle like functionality
                      }}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle share functionality
                      }}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Image Info */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">{image.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentSeason.images.find(img => img.id === selectedImage)?.url}
              alt="Lookbook image"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <ZoomIn className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="bg-black text-white py-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link href="/about-us" className="hover:opacity-80 transition-opacity">
              ← About Us
            </Link>
            <Link href="/contact-us" className="hover:opacity-80 transition-opacity">
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
