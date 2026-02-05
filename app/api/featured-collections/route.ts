import { NextRequest, NextResponse } from 'next/server'

// Featured collections database with curated collections
let featuredCollections: FeaturedCollection[] = [
  {
    id: 1,
    name: 'Editor\'s Choice',
    description: 'Handpicked favorites by our editorial team',
    categories: ['Evening Wear', 'Blazer', 'Cocktail'],
    type: 'editors',
    featured: true,
  },
  {
    id: 2,
    name: 'Best Sellers',
    description: 'Most loved pieces by our customers',
    categories: ['Blouse', 'Jeans', 'Jacket'],
    type: 'bestsellers',
    featured: true,
  },
  {
    id: 3,
    name: 'Limited Edition',
    description: 'Exclusive pieces with limited availability',
    categories: ['Evening Wear', 'Coat'],
    type: 'limited',
    featured: true,
  },
  {
    id: 4,
    name: 'Seasonal Highlights',
    description: 'Perfect pieces for the current season',
    categories: ['Jacket', 'Blazer', 'Jeans'],
    type: 'seasonal',
    featured: true,
  },
  {
    id: 5,
    name: 'Runway Inspired',
    description: 'Pieces inspired by latest fashion weeks',
    categories: ['Evening Wear', 'Cocktail'],
    type: 'runway',
    featured: true,
  },
]

export interface FeaturedCollection {
  id: number
  name: string
  description?: string
  categories?: string[]
  type: 'editors' | 'bestsellers' | 'limited' | 'seasonal' | 'runway'
  featured: boolean
  productCount?: number
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    if (id) {
      const collection = featuredCollections.find((c) => c.id === parseInt(id))
      if (!collection) {
        return NextResponse.json(
          { success: false, error: 'Featured collection not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: collection })
    }

    if (type) {
      const collections = featuredCollections.filter((c) => c.type === type)
      return NextResponse.json({ 
        success: true, 
        data: collections,
        count: collections.length 
      })
    }

    // Return all featured collections
    return NextResponse.json({
      success: true,
      data: featuredCollections,
      count: featuredCollections.length,
    })
  } catch (error) {
    console.error('[API] Featured Collections error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, categories, type } = body

    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: 'Collection name and type are required' },
        { status: 400 }
      )
    }

    const newCollection: FeaturedCollection = {
      id: Math.max(...featuredCollections.map((c) => c.id), 0) + 1,
      name,
      description: description || '',
      categories: categories || [],
      type,
      featured: true,
    }

    featuredCollections.push(newCollection)

    return NextResponse.json({ success: true, data: newCollection }, { status: 201 })
  } catch (error) {
    console.error('[API] Create featured collection error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create featured collection' },
      { status: 500 }
    )
  }
}

// Export featured collections for use in other routes
export function getFeaturedCollections() {
  return featuredCollections
}
