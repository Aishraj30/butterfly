// Mock product database - in production, this would come from an actual database
export const products = [
  {
    id: 1,
    name: 'Silk Butterfly Gown',
    price: 1250,
    category: 'Evening Wear',
    color: 'Black',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviews: 124,
    image: 'bg-gradient-to-br from-purple-100 to-pink-100',
    inStock: true,
  },
  {
    id: 2,
    name: 'Crystal Embellished Dress',
    price: 980,
    category: 'Cocktail',
    color: 'Cream',
    size: ['XS', 'S', 'M', 'L'],
    rating: 4.6,
    reviews: 89,
    image: 'bg-gradient-to-br from-pink-100 to-rose-100',
    inStock: true,
  },
  {
    id: 3,
    name: 'Ethereal Drape Jacket',
    price: 750,
    category: 'Jacket',
    color: 'Navy',
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviews: 156,
    image: 'bg-gradient-to-br from-amber-50 to-orange-100',
    inStock: true,
  },
  {
    id: 4,
    name: 'Luxe Structured Blazer',
    price: 890,
    category: 'Blazer',
    color: 'Black',
    size: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviews: 103,
    image: 'bg-gradient-to-br from-slate-100 to-gray-100',
    inStock: true,
  },
  {
    id: 5,
    name: 'Silk Charmeuse Blouse',
    price: 520,
    category: 'Blouse',
    color: 'Gold',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviews: 67,
    image: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    inStock: true,
  },
  {
    id: 6,
    name: 'Premium Wool Coat',
    price: 1450,
    category: 'Coat',
    color: 'Camel',
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviews: 142,
    image: 'bg-gradient-to-br from-orange-50 to-yellow-100',
    inStock: true,
  },
]

export interface Product {
  id: number
  name: string
  price: number
  category: string
  color: string
  size: string[]
  rating: number
  reviews: number
  image: string
  inStock: boolean
}

export interface FilterOptions {
  categories?: string[]
  sizes?: string[]
  colors?: string[]
  priceRange?: [number, number]
  search?: string
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating'
}

export function filterAndSortProducts(
  allProducts: Product[],
  filters: FilterOptions
): Product[] {
  let filtered = [...allProducts]

  // Search filter
  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((p) => filters.categories!.includes(p.category))
  }

  // Color filter
  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter((p) => filters.colors!.includes(p.color))
  }

  // Size filter
  if (filters.sizes && filters.sizes.length > 0) {
    filtered = filtered.filter((p) =>
      filters.sizes!.some((s) => p.size.includes(s))
    )
  }

  // Price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    filtered = filtered.filter((p) => p.price >= min && p.price <= max)
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        // Keep original order (newest first)
        break
    }
  }

  return filtered
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getRelatedProducts(productId: number, limit = 3): Product[] {
  const product = getProductById(productId)
  if (!product) return []

  return products
    .filter(
      (p) =>
        p.id !== productId &&
        (p.category === product.category || p.color === product.color)
    )
    .slice(0, limit)
}
