'use client'

import { Users, DollarSign, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: number
  changeText: string
  icon: React.ReactNode
  color: string
}

function MetricCard({ title, value, change, changeText, icon, color }: MetricCardProps) {
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm font-medium">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-black dark:text-white">
          {value}
        </p>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
            {isPositive ? <TrendingUp size={16} /> : isNegative ? <TrendingDown size={16} /> : null}
            {Math.abs(change)}%
          </div>
          <span className="text-sm text-gray-600">
            {changeText}
          </span>
        </div>
      </div>
    </div>
  )
}

export function MetricsCards() {
  const metrics = [
    {
      title: 'Customers',
      value: '45,000',
      change: 7,
      changeText: 'vs. previous month',
      icon: <Users size={20} className="text-black dark:text-white" />,
      color: 'bg-gray-100 dark:bg-gray-800'
    },
    {
      title: 'Total Sales',
      value: '₹45,000',
      change: 7,
      changeText: 'vs. previous month',
      icon: <DollarSign size={20} className="text-black dark:text-white" />,
      color: 'bg-gray-100 dark:bg-gray-800'
    },
    {
      title: 'Total Order',
      value: '65,000',
      change: -3.5,
      changeText: 'vs. previous month',
      icon: <ShoppingCart size={20} className="text-black dark:text-white" />,
      color: 'bg-gray-100 dark:bg-gray-800'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          changeText={metric.changeText}
          icon={metric.icon}
          color={metric.color}
        />
      ))}
    </div>
  )
}
