import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const lookbookItems = [
  {
    id: 1,
    title: 'Urban Elegance',
    description: 'Modern luxury meets city style',
    image: 'bg-gradient-to-br from-slate-100 to-gray-100',
    featured: 'Ethereal Drape Jacket',
    featuredId: 3,
  },
  {
    id: 2,
    title: 'Evening Grace',
    description: 'Timeless beauty for special moments',
    image: 'bg-gradient-to-br from-purple-100 to-pink-100',
    featured: 'Silk Butterfly Gown',
    featuredId: 1,
  },
  {
    id: 3,
    title: 'Casual Luxury',
    description: 'Sophisticated comfort in everyday wear',
    image: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    featured: 'Silk Charmeuse Blouse',
    featuredId: 5,
  },
  {
    id: 4,
    title: 'Golden Hour',
    description: 'Radiant pieces for radiant moments',
    image: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    featured: 'Premium Wool Coat',
    featuredId: 6,
  },
]

const editorialContent = [
  {
    title: 'The Art of Layering',
    excerpt: 'Discover how to master the art of layering with our versatile pieces.',
    image: 'bg-gradient-to-br from-pink-100 to-rose-100',
    readTime: '5 min read',
  },
  {
    title: 'Sustainable Luxury',
    excerpt: 'How we source materials ethically without compromising on elegance.',
    image: 'bg-gradient-to-br from-green-100 to-blue-100',
    readTime: '7 min read',
  },
  {
    title: 'Timeless Pieces',
    excerpt: 'Investment pieces that transcend trends and seasons.',
    image: 'bg-gradient-to-br from-orange-50 to-yellow-100',
    readTime: '6 min read',
  },
]

export default function LookbookPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative min-h-screen bg-secondary overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl" />
            <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-3xl" />
          </div>

          <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto px-4">
            <span className="inline-block text-xs font-semibold text-accent uppercase tracking-widest bg-accent/10 px-4 py-2 rounded-full">
              Visual Inspiration
            </span>
            <h1 className="font-serif text-6xl md:text-7xl font-bold text-primary leading-tight">
              Lookbook
            </h1>
            <p className="text-lg text-foreground/70 font-light">
              Explore our curated visual collection showcasing the art of styling Butterfly Couture pieces.
            </p>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center gap-2 text-primary/40 animate-bounce">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Lookbook Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-serif text-4xl font-bold text-primary mb-12">
            Featured Looks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lookbookItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-sm aspect-square mb-6">
                  <div className={`w-full h-full ${item.image} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                    <span className="text-foreground/20">Lookbook Image</span>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Title Overlay */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-bold text-primary-foreground">
                        {item.title}
                      </h3>
                      <p className="text-primary-foreground/90 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Featured Product */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-accent uppercase tracking-widest">
                    Featured Product
                  </p>
                  <Link
                    href={`/product/${item.featuredId}`}
                    className="block group/link"
                  >
                    <h4 className="font-semibold text-foreground group-hover/link:text-primary transition-colors mb-2">
                      {item.featured}
                    </h4>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover/link:opacity-100 transition-opacity">
                      View Product
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Section */}
        <div className="bg-secondary border-t border-border py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-4xl font-bold text-primary mb-12">
              Editorial
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {editorialContent.map((article, idx) => (
                <article
                  key={idx}
                  className="group cursor-pointer space-y-4"
                >
                  <div className="relative overflow-hidden rounded-sm aspect-video">
                    <div className={`w-full h-full ${article.image} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                      <span className="text-foreground/20">Article Image</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                      {article.title}
                    </h3>
                    <p className="text-foreground/60 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                    <p className="text-xs text-foreground/40 font-medium">
                      {article.readTime}
                    </p>
                  </div>

                  <button className="inline-block px-4 py-2 border border-primary text-primary text-sm font-medium rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Article
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Inspiration Tips */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-serif text-4xl font-bold text-primary mb-12">
            Styling Tips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Start with Basics',
                description: 'Build your look around neutral, high-quality basics that work with multiple pieces.',
              },
              {
                num: '02',
                title: 'Add Statement Pieces',
                description: 'Incorporate one bold or textured item to elevate your overall aesthetic.',
              },
              {
                num: '03',
                title: 'Accessorize Thoughtfully',
                description: 'Choose accessories that complement rather than compete with your outfit.',
              },
            ].map((tip) => (
              <div
                key={tip.num}
                className="border-l-4 border-primary pl-6 space-y-3"
              >
                <span className="text-4xl font-bold text-primary/20 font-serif">
                  {tip.num}
                </span>
                <h3 className="font-semibold text-lg text-foreground">
                  {tip.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="font-serif text-4xl font-bold">
              Ready to Shop These Looks?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Explore our complete collection and bring these inspiring looks to life with your own personal style.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-background text-primary font-semibold rounded-sm hover:bg-foreground transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
