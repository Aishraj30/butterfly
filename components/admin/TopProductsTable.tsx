'use client'

import { Star } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  review: number
  sold: number
  profit: string
}

const topProducts: Product[] = [
  {
    id: 1,
    name: 'Casual T-Shirt Cotton',
    review: 4.7,
    sold: 210,
    profit: '₹22.2K'
  },
  {
    id: 2,
    name: 'Shirt Casual Elegant',
    review: 4.5,
    sold: 210,
    profit: '₹22.2K'
  },
  {
    id: 3,
    name: 'Bomber Jacket Winter',
    review: 4.0,
    sold: 210,
    profit: '₹22.2K'
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < Math.floor(rating)
              ? 'fill-gray-600 text-gray-600'
              : 'text-gray-300 dark:text-gray-600'
              }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
        {rating}
      </span>
    </div>
  )
}

export function TopProductsTable() {
  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Products
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Best performing products
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm text-black dark:text-white hover:underline font-medium"
        >
          See All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                No
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Product Name
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Review
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Sold
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Profit
              </th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="py-3 px-2 text-sm text-gray-900 dark:text-white">
                  {product.id}
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <StarRating rating={product.review} />
                </td>
                <td className="py-3 px-2 text-sm text-gray-900 dark:text-white">
                  {product.sold}
                </td>
                <td className="py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                  {product.profit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
