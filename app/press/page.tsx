'use client'

import Link from 'next/link'
import { ArrowLeft, Newspaper, Calendar } from 'lucide-react'

export default function PressPage() {
  const pressReleases = [
    {
      date: 'January 15, 2026',
      title: 'Butterfly Couture Launches Spring 2024 Collection',
      excerpt: 'The new collection celebrates rebirth and transformation through innovative designs and sustainable materials.',
      category: 'Collection Launch'
    },
    {
      date: 'December 1, 2025',
      title: 'Butterfly Couture Named Sustainable Brand of the Year',
      excerpt: 'Recognition for our commitment to ethical fashion and environmental responsibility in luxury design.',
      category: 'Awards'
    },
    {
      date: 'October 20, 2025',
      title: 'Founder Interview: Redefining Luxury Fashion',
      excerpt: 'Our founder discusses the vision behind Butterfly Couture and the future of sustainable luxury.',
      category: 'Interview'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-center">
          <h1 className="text-2xl font-light tracking-wide text-gray-900">PRESS</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Press Kit Info */}
          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Newspaper className="w-8 h-8 text-black" />
              <div>
                <h2 className="text-2xl font-light">Press Kit & Media Resources</h2>
                <p className="text-gray-600 mt-2">
                  Download our official press kit for high-resolution images, brand assets, and company information.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
                Download Press Kit
              </button>
              <Link href="/contact-us" className="border border-black text-black px-6 py-3 rounded hover:bg-black hover:text-white transition-colors">
                Contact PR Team
              </Link>
            </div>
          </div>

          {/* Press Releases */}
          <div className="space-y-12">
            <h2 className="text-3xl font-light tracking-wide mb-8">Latest Press Releases</h2>
            
            {pressReleases.map((release, index) => (
              <article key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex flex-col sm:flex-row gap-6 mb-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <time className="text-sm">{release.date}</time>
                  </div>
                  <span className="bg-black text-white text-xs px-2 py-1 rounded">
                    {release.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-light mb-4">{release.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{release.excerpt}</p>
                
                <Link href="#" className="inline-flex items-center gap-2 text-black hover:opacity-80 transition-opacity">
                  Read Full Article →
                </Link>
              </article>
            ))}
          </div>

          {/* Media Contact */}
          <div className="bg-black text-white p-8 rounded-lg mt-12">
            <h3 className="text-xl font-light mb-4 text-center">Media Inquiries</h3>
            <div className="text-center">
              <p className="text-gray-300 mb-6">
                For press inquiries, interview requests, or media partnerships, please contact our PR team.
              </p>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> press@butterflycouture.com</p>
                <p><span className="font-medium">Phone:</span> 1-555-PRESS-01</p>
                <p><span className="font-medium">Response Time:</span> Within 24 hours</p>
              </div>
              <div className="flex justify-center mt-6">
                <Link href="/contact-us" className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                  Contact PR Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
