import { HeroBanner } from '@/components/ui/HeroBanner'
import { ProductCarousel } from '@/components/ui/ProductCarousel'
import connectDB from '@/lib/db'
import Collection from '@/models/Collection'
import Product from '@/models/Product'

// Sample data for multiple sections
const heroBanners = [
  {
    id: 1,
    title: "BUTTERFLY",
    subtitle: "Discover latest trends in fashion",
    buttonText: "Shop Now",
    buttonLink: "/catalog",
    backgroundImage: "/banners/b1.JPG"
  },
  {
    id: 2,
    title: "NEW COLLECTION",
    subtitle: "Elevate your style with our premium pieces",
    buttonText: "Explore",
    buttonLink: "/new-arrival",
    backgroundImage: "/banners/b2.JPG"
  },
  {
    id: 3,
    title: "SUMMER ESSENTIALS",
    subtitle: "Light fabrics for warm days ahead",
    buttonText: "View Collection",
    buttonLink: "/catalog",
    backgroundImage: "/banners/b3.jpg"
  },
  {
    id: 4,
    title: "LUXURY LINE",
    subtitle: "Premium materials meet timeless design",
    buttonText: "Discover",
    buttonLink: "/catalog",
    backgroundImage: "/banners/b1.JPG"
  }
]
// Fallback data in case DB is empty
const fallbackHero = {
  title: "BUTTERFLY COUTURE",
  subtitle: "Exquisite Fashion for the Modern Individual",
  buttonText: "Shop Collection",
  buttonLink: "/catalog",
  backgroundImage: "/hero.JPG"
}

export default async function Home() {
  await connectDB()

  // Ensure Product model is registered for populate
  console.log("📦 Initializing models:", Product.modelName, Collection.modelName)
  const collections = await Collection.find({ isActive: true })
    .populate('products')
    .sort({ createdAt: -1 })
    .limit(7)

  return (
    <main className="min-h-screen">
      {collections.length > 0 ? (
        collections.map((col: any, index: number) => (
          <div key={col._id.toString()}>
            {/* Hero Banner for the collection */}
            <HeroBanner
              title={col.name.toUpperCase()}
              subtitle={col.description || "Discover our latest premium collection"}
              buttonText="Explore Collection"
              buttonLink={`/collections/${col.slug}`}
              backgroundImage={col.bannerImage || "/pic1.jpg"}
              showScrollIndicator={index < collections.length - 1}
              isFirst={index === 0}
            />

            {/* Product Carousel for the collection */}
            {col.products && col.products.length > 0 && (
              <ProductCarousel
                title={`${col.name} Highlights`}
                products={col.products.map((p: any) => ({
                  id: p._id.toString(),
                  name: p.name,
                  price: `₹${p.price.toLocaleString()}`,
                  image: p.images?.[0] || "/uploads/product-1769084011566.jpeg"
                }))}
                shopAllLink={`/catalog?collection=${encodeURIComponent(col.name)}`}
              />
            )}
          </div>
        ))
      ) : (
        /* Fallback if no collections in DB */
        <div>
          <HeroBanner
            {...fallbackHero}
            showScrollIndicator={true}
            isFirst={true}
          />
          <div className="py-20 text-center text-gray-400">
            <p>No collections found. Visit the admin dashboard to create one.</p>
          </div>
        </div>
      )}
    </main>
  )
}
