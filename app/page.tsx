import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />

        {/* Editorial Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="h-96 md:h-full rounded-sm bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-foreground/20">Editorial Image</span>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <p className="text-accent font-semibold uppercase tracking-widest text-sm">
                  Our Story
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary leading-tight">
                  Crafted with Passion
                </h2>
                <p className="text-foreground/70 font-light leading-relaxed">
                  Every piece in our collection tells a story of meticulous craftsmanship and artistic vision. 
                  We believe in creating timeless pieces that transcend trends and celebrate the beauty of elegance.
                </p>
                <p className="text-foreground/70 font-light leading-relaxed">
                  Our butterfly-inspired designs symbolize transformation and grace, reflecting the essence of 
                  modern luxury fashion.
                </p>
                <button className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors mt-4">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="font-serif text-4xl font-bold">
              Exclusive Access
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and styling tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-primary-foreground text-primary rounded-sm placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-background text-primary font-medium rounded-sm hover:bg-foreground transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
