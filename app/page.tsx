import { HeroBanner } from '@/components/ui/HeroBanner'
import { ProductCarousel } from '@/components/ui/ProductCarousel'

// Sample data for multiple sections
const heroBanners = [
  {
    id: 1,
    title: "BUTTERFLY",
    subtitle: "Discover the latest trends in fashion",
    buttonText: "Shop Now",
    buttonLink: "/catalog",
    backgroundImage: "/hero.JPG"
  },
  {
    id: 2,
    title: "NEW COLLECTION",
    subtitle: "Elevate your style with our premium pieces",
    buttonText: "Explore",
    buttonLink: "/new-arrival",
    backgroundImage: "/pic1.jpg"
  },
  {
    id: 3,
    title: "SUMMER ESSENTIALS",
    subtitle: "Light fabrics for warm days ahead",
    buttonText: "View Collection",
    buttonLink: "/catalog",
    backgroundImage: "/pic2.jpg"
  },
  {
    id: 4,
    title: "LUXURY LINE",
    subtitle: "Premium materials meet timeless design",
    buttonText: "Discover",
    buttonLink: "/catalog",
    backgroundImage: "/male-photo.jpeg"
  },
  {
    id: 5,
    title: "URBAN STYLE",
    subtitle: "Streetwear that makes a statement",
    buttonText: "Shop Now",
    buttonLink: "/catalog",
    backgroundImage: "/hero.JPG"
  },
  {
    id: 6,
    title: "CLASSIC ELEGANCE",
    subtitle: "Timeless pieces for modern wardrobes",
    buttonText: "Explore",
    buttonLink: "/catalog",
    backgroundImage: "/pic1.jpg"
  },
  {
    id: 7,
    title: "FINAL TOUCH",
    subtitle: "Complete your look with our accessories",
    buttonText: "Shop Accessories",
    buttonLink: "/catalog",
    backgroundImage: "/pic2.jpg"
  }
]

const carouselData = [
  {
    id: 1,
    title: "Featured Products",
    products: [
      { id: '1', name: 'Classic Hoodie', price: '$89.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '2', name: 'Premium Sweatshirt', price: '$79.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '3', name: 'Streetwear Jacket', price: '$129.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '4', name: 'Urban Pullover', price: '$69.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '5', name: 'Casual Sweater', price: '$59.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '6', name: 'Designer Hoodie', price: '$99.99', image: '/uploads/product-1769084011566.jpeg' }
    ]
  },
  {
    id: 2,
    title: "New Arrivals",
    products: [
      { id: '7', name: 'Summer Dress', price: '$119.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '8', name: 'Beach Shirt', price: '$49.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '9', name: 'Linen Pants', price: '$89.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '10', name: 'Sandals', price: '$39.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '11', name: 'Sun Hat', price: '$29.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '12', name: 'Beach Bag', price: '$79.99', image: '/uploads/product-1769084011566.jpeg' }
    ]
  },
  {
    id: 3,
    title: "Summer Essentials",
    products: [
      { id: '13', name: 'Tank Top', price: '$29.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '14', name: 'Shorts', price: '$49.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '15', name: 'Cap', price: '$19.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '16', name: 'Sunglasses', price: '$89.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '17', name: 'Flip Flops', price: '$24.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '18', name: 'Water Bottle', price: '$15.99', image: '/uploads/product-1769084011566.jpeg' }
    ]
  },
  {
    id: 4,
    title: "Luxury Collection",
    products: [
      { id: '19', name: 'Silk Shirt', price: '$199.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '20', name: 'Cashmere Sweater', price: '$299.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '21', name: 'Leather Jacket', price: '$599.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '22', name: 'Designer Watch', price: '$399.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '23', name: 'Premium Shoes', price: '$249.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '24', name: 'Luxury Bag', price: '$449.99', image: '/uploads/product-1769084011566.jpeg' }
    ]
  },
  {
    id: 5,
    title: "Urban Streetwear",
    products: [
      { id: '25', name: 'Graphic Tee', price: '$39.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '26', name: 'Cargo Pants', price: '$79.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '27', name: 'Sneakers', price: '$119.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '28', name: 'Backpack', price: '$69.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '29', name: 'Baseball Cap', price: '$29.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '30', name: 'Phone Case', price: '$19.99', image: '/uploads/product-1769084011566.jpeg' }
    ]
  },
  {
    id: 6,
    title: "Classic Essentials",
    products: [
      { id: '31', name: 'White Shirt', price: '$59.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '32', name: 'Blue Jeans', price: '$89.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '33', name: 'Black Belt', price: '$39.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '34', name: 'Leather Wallet', price: '$49.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '35', name: 'Classic Watch', price: '$149.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '36', name: 'Dress Shoes', price: '$179.99', image: '/uploads/product-1769084011566.jpeg' }
    ]
  },
  {
    id: 7,
    title: "Accessories",
    products: [
      { id: '37', name: 'Scarf', price: '$34.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '38', name: 'Gloves', price: '$24.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '39', name: 'Tie', price: '$29.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '40', name: 'Cufflinks', price: '$44.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '41', name: 'Pocket Square', price: '$19.99', image: '/uploads/product-1769084011566.jpeg' },
      { id: '42', name: 'Tie Clip', price: '$14.99', image: '/uploads/product-1769084011566.jpeg' }
    ]
  }
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Create alternating layout: Hero -> Carousel x4 times */}
      {Array.from({ length: 4 }, (_, index) => {
        const heroIndex = index
        const carouselIndex = index
        
        return (
          <div key={index}>
            {/* Hero Banner */}
            <HeroBanner 
              title={heroBanners[heroIndex].title}
              subtitle={heroBanners[heroIndex].subtitle}
              buttonText={heroBanners[heroIndex].buttonText}
              buttonLink={heroBanners[heroIndex].buttonLink}
              backgroundImage={heroBanners[heroIndex].backgroundImage}
              showScrollIndicator={index < 3} // Hide scroll indicator on last hero
              isFirst={index === 0} // Only first hero gets extreme top positioning
            />
            
            {/* Product Carousel */}
            <ProductCarousel 
              title={carouselData[carouselIndex].title}
              products={carouselData[carouselIndex].products}
            />
          </div>
        )
      })}
    </main>
  )
}
