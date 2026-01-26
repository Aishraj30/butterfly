import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/products'

// Mock collections database with category mapping
let collections: Collection[] = [
  {
    id: 1,
    name: 'Blouse',
    description: 'Elegant blouses for various occasions',
    categories: ['Blouse'],
  },
  {
    id: 2,
    name: 'Jeans',
    description: 'Premium denim collection',
    categories: ['Jeans'],
  },
  {
    id: 3,
    name: 'Jacket',
    description: 'Stylish jackets and outerwear',
    categories: ['Jacket', 'Coat'],
  },
  {
    id: 4,
    name: 'Evening Wear',
    description: 'Formal and elegant evening dresses',
    categories: ['Evening Wear', 'Cocktail'],
  },
  {
    id: 5,
    name: 'Blazer',
    description: 'Structured blazers for professional looks',
    categories: ['Blazer'],
  },
]

export interface Collection {
  id: number
  name: string
  description?: string
  categories?: string[]
  productCount?: number
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (id) {
      const collection = collections.find((c) => c.id === parseInt(id))
      if (!collection) {
        return NextResponse.json(
          { success: false, error: 'Collection not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: collection })
    }

    // Get product count for each collection
    const allProducts = getAllProducts()
    const collectionsWithCount = collections.map((collection) => {
      const count = allProducts.filter((p) =>
        collection.categories?.includes(p.category)
      ).length
      return { ...collection, productCount: count }
    })

    return NextResponse.json({
      success: true,
      data: collectionsWithCount,
      count: collectionsWithCount.length,
    })
  } catch (error) {
    console.error('[API] Collections error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, categories } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Collection name is required' },
        { status: 400 }
      )
    }

    const newCollection: Collection = {
      id: Math.max(...collections.map((c) => c.id), 0) + 1,
      name,
      description: description || '',
      categories: categories || [name],
    }

    collections.push(newCollection)

    return NextResponse.json({ success: true, data: newCollection }, { status: 201 })
  } catch (error) {
    console.error('[API] Create collection error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, categories } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Collection ID is required' },
        { status: 400 }
      )
    }

    const index = collections.findIndex((c) => c.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      )
    }

    collections[index] = {
      ...collections[index],
      name: name || collections[index].name,
      description: description !== undefined ? description : collections[index].description,
      categories: categories || collections[index].categories,
    }

    return NextResponse.json({ success: true, data: collections[index] })
  } catch (error) {
    console.error('[API] Update collection error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Collection ID is required' },
        { status: 400 }
      )
    }

    const index = collections.findIndex((c) => c.id === parseInt(id))
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      )
    }

    const deleted = collections.splice(index, 1)[0]

    return NextResponse.json({ success: true, data: deleted })
  } catch (error) {
    console.error('[API] Delete collection error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}

// Export collections for use in other routes
export function getCollections() {
  return collections
}
