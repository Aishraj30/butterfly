import { AdminSidebar } from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { TrendingUp, Package, ShoppingCart, Users, ArrowUpRight } from 'lucide-react'

const stats = [
  {
    label: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    label: 'Total Orders',
    value: '1,234',
    change: '+12.5%',
    icon: ShoppingCart,
    color: 'text-blue-600',
  },
  {
    label: 'Products',
    value: '248',
    change: '+5.2%',
    icon: Package,
    color: 'text-purple-600',
  },
  {
    label: 'Customers',
    value: '892',
    change: '+8.3%',
    icon: Users,
    color: 'text-orange-600',
  },
]

const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Johnson', amount: '$1,250', status: 'Delivered' },
  { id: 'ORD-002', customer: 'Michael Chen', amount: '$980', status: 'Processing' },
  { id: 'ORD-003', customer: 'Emma Wilson', amount: '$2,100', status: 'Pending' },
  { id: 'ORD-004', customer: 'James Brown', amount: '$750', status: 'Delivered' },
  { id: 'ORD-005', customer: 'Lisa Anderson', amount: '$1,500', status: 'Shipped' },
]

const topProducts = [
  { name: 'Silk Butterfly Gown', sales: 245, revenue: '$306,250' },
  { name: 'Crystal Embellished Dress', sales: 189, revenue: '$185,220' },
  { name: 'Ethereal Drape Jacket', sales: 167, revenue: '$125,250' },
  { name: 'Luxe Structured Blazer', sales: 142, revenue: '$126,380' },
  { name: 'Premium Wool Coat', sales: 98, revenue: '$142,100' },
]

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-secondary border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary">
                  Dashboard
                </h1>
                <p className="text-foreground/60 text-sm mt-1">
                  Welcome back! Here's what's happening with your store.
                </p>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-background border border-border rounded-sm p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/60 text-sm font-medium">
                      {stat.label}
                    </span>
                    <div className={`p-2 bg-secondary rounded-sm ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                      <ArrowUpRight size={12} />
                      {stat.change} from last month
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts & Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-background border border-border rounded-sm p-6 space-y-6">
              <div>
                <h2 className="font-semibold text-foreground text-lg">
                  Revenue Overview
                </h2>
                <p className="text-foreground/60 text-sm">
                  Last 7 days performance
                </p>
              </div>

              {/* Placeholder Chart */}
              <div className="h-64 bg-secondary rounded-sm flex items-end justify-center gap-2 p-4">
                {[60, 75, 45, 90, 70, 85, 65].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary rounded-t-sm transition-all hover:opacity-80"
                    style={{ height: `${(height / 100) * 100}%` }}
                  />
                ))}
              </div>

              <div className="text-xs text-foreground/60 text-center">
                Chart visualization (integrate Recharts for production)
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                <h2 className="font-semibold text-foreground">Quick Actions</h2>
                <div className="space-y-2">
                  <Link
                    href="/admin/products"
                    className="block px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors text-center"
                  >
                    Add Product
                  </Link>
                  <Link
                    href="/admin/pages"
                    className="block px-4 py-2 border border-primary text-primary text-sm font-medium rounded-sm hover:bg-primary/5 transition-colors text-center"
                  >
                    Create Page
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="block px-4 py-2 border border-primary text-primary text-sm font-medium rounded-sm hover:bg-primary/5 transition-colors text-center"
                  >
                    View Orders
                  </Link>
                </div>
              </div>

              {/* Conversion Metrics */}
              <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                <h2 className="font-semibold text-foreground">Key Metrics</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground/70">Conversion Rate</span>
                      <span className="font-semibold">3.2%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-3/12 bg-primary rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground/70">Cart Completion</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-8/12 bg-accent rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground/70">Return Rate</span>
                      <span className="font-semibold">2.8%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-1/12 bg-green-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Orders */}
            <div className="bg-background border border-border rounded-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground text-lg">
                  Recent Orders
                </h2>
                <Link href="/admin/orders" className="text-primary text-sm font-medium hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-sm hover:bg-secondary/80 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {order.id}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {order.customer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground text-sm">
                        {order.amount}
                      </p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-background border border-border rounded-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground text-lg">
                  Top Products
                </h2>
                <Link href="/admin/products" className="text-primary text-sm font-medium hover:underline">
                  Manage
                </Link>
              </div>

              <div className="space-y-3">
                {topProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-secondary rounded-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {product.sales} sales
                      </p>
                    </div>
                    <p className="font-semibold text-primary">
                      {product.revenue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
