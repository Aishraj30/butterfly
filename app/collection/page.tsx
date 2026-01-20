import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

const collections = [
  {
    id: 1,
    name: 'Evening Wear',
    description: 'Exquisite gowns and evening dresses for special occasions',
    image: 'bg-gradient-to-br from-purple-100 to-pink-100',
    href: '/shop?category=Evening Wear',
    itemCount: 24,
  },
  {
    id: 2,
    name: 'Casual Elegance',
    description: 'Effortlessly chic pieces for everyday luxury',
    image: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    href: '/shop?category=Casual',
    itemCount: 32,
  },
  {
    id: 3,
    name: 'Blazers & Jackets',
    description: 'Structured and sophisticated outerwear',
    image: 'bg-gradient-to-br from-slate-100 to-gray-100',
    href: '/shop?category=Jacket',
    itemCount: 18,
  },
  {
    id: 4,
    name: 'Accessories',
    description: 'Finishing touches that complete your look',
    image: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    href: '/shop?category=Accessories',
    itemCount: 45,
  },
]

const seasonalCollections = [
  {
    title: 'Spring/Summer 2024',
    description: 'Light, airy fabrics and vibrant colors perfect for warmer months',
    featured: 'Ethereal Drape Jacket',
    image: 'bg-gradient-to-br from-green-100 to-blue-100',
  },
  {
    title: 'Fall/Winter 2024',
    description: 'Rich textures and deep tones for the cooler season',
    featured: 'Premium Wool Coat',
    image: 'bg-gradient-to-br from-orange-100 to-red-100',
  },
  {
    title: 'Special Occasion',
    description: 'Statement pieces for unforgettable moments',
    featured: 'Silk Butterfly Gown',
    image: 'bg-gradient-to-br from-pink-100 to-rose-100',
  },
]

export default function CollectionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">
              Collections
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Explore our curated collections, each designed to tell a unique story of elegance and sophistication.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Main Collections */}
          <div>
            <h2 className="font-serif text-4xl font-bold text-primary mb-12">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={collection.href}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-sm aspect-square mb-4">
                    <div className={`w-full h-full ${collection.image} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                      <span className="text-foreground/20">Collection Image</span>
                    </div>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="font-serif text-3xl font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {collection.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-2">
                    {collection.description}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {collection.itemCount} items
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Seasonal Collections */}
          <div className="border-t border-border pt-20">
            <h2 className="font-serif text-4xl font-bold text-primary mb-12">
              Seasonal Collections
            </h2>
            <div className="space-y-12">
              {seasonalCollections.map((collection, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    idx % 2 === 1 ? 'lg:grid-cols-2 lg:grid-flow-col lg:[grid-auto-flow:dense]' : ''
                  }`}
                >
                  {idx % 2 === 0 ? (
                    <>
                      <div className={`${collection.image} rounded-sm aspect-video flex items-center justify-center`}>
                        <span className="text-foreground/20">Collection Image</span>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-serif text-3xl font-bold text-primary">
                          {collection.title}
                        </h3>
                        <p className="text-foreground/70 leading-relaxed">
                          {collection.description}
                        </p>
                        <p className="font-semibold text-foreground">
                          Featured: <span className="text-primary">{collection.featured}</span>
                        </p>
                        <Link
                          href="/shop"
                          className="inline-block px-6 py-2 border border-primary text-primary font-medium rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          Explore Collection
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <h3 className="font-serif text-3xl font-bold text-primary">
                          {collection.title}
                        </h3>
                        <p className="text-foreground/70 leading-relaxed">
                          {collection.description}
                        </p>
                        <p className="font-semibold text-foreground">
                          Featured: <span className="text-primary">{collection.featured}</span>
                        </p>
                        <Link
                          href="/shop"
                          className="inline-block px-6 py-2 border border-primary text-primary font-medium rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          Explore Collection
                        </Link>
                      </div>
                      <div className={`${collection.image} rounded-sm aspect-video flex items-center justify-center`}>
                        <span className="text-foreground/20">Collection Image</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Styling Tips */}
          <div className="mt-20 border-t border-border pt-20">
            <h2 className="font-serif text-4xl font-bold text-primary mb-8 text-center">
              Styling Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Mix & Match',
                  description: 'Combine pieces from different collections to create your own unique style.',
                },
                {
                  title: 'Occasions',
                  description: 'From casual to evening wear, find the perfect piece for every moment.',
                },
                {
                  title: 'Timeless Pieces',
                  description: 'Invest in classic designs that transcend trends and seasons.',
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="bg-secondary border border-border rounded-sm p-8 text-center space-y-4"
                >
                  <h3 className="font-semibold text-lg text-primary">
                    {tip.title}
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
