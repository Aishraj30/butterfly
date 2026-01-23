'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const customerData = [
  { name: 'Male', value: 942, percentage: 27.7 },
  { name: 'Female', value: 2452, percentage: 72.3 },
]

const COLORS = ['#D7C69D', '#003300']

export function CustomerStatisticsChart() {
  const totalCustomers = customerData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].value} ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = () => {
    return (
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="fill-gray-900 dark:fill-white"
      >
        <tspan x="50%" dy="-0.5em" className="text-2xl font-bold text-[#005500]">100%</tspan>
        <tspan x="50%" dy="1.5em" className="text-sm text-gray-600">Total Customers</tspan>
      </text>
    )
  }

  return (
    <div className="bg-white border border-[#D7C69D]/30 rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#005500]">
          Customers Statistics
        </h2>
        <p className="text-sm text-gray-600">
          Gender distribution
        </p>
      </div>

      {/* Donut Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={customerData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {customerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {customerData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.value.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
