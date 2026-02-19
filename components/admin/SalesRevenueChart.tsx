'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const monthlyData = [
  { month: 'Jan', revenue: 25000 },
  { month: 'Feb', revenue: 30000 },
  { month: 'Mar', revenue: 28000 },
  { month: 'Apr', revenue: 35000 },
  { month: 'May', revenue: 40000 },
  { month: 'Jun', revenue: 45000 },
  { month: 'Jul', revenue: 42000 },
  { month: 'Aug', revenue: 38000 },
  { month: 'Sep', revenue: 41000 },
  { month: 'Oct', revenue: 39000 },
  { month: 'Nov', revenue: 43000 },
  { month: 'Dec', revenue: 47000 },
]

const timeFilters = [
  { label: '1D', value: '1d' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
]

export function SalesRevenueChart() {
  const [selectedFilter, setSelectedFilter] = useState('1y')

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Sales Revenue
          </h2>
          <p className="text-sm text-gray-600">
            Monthly sales overview
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${selectedFilter === filter.value
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm border border-gray-300 dark:border-gray-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
              tickFormatter={(value) => `₹${(value / 1000)}k`}
            />
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar
              dataKey="revenue"
              fill="#000000"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
