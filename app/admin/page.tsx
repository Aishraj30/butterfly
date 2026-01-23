'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { MetricsCards } from '@/components/admin/MetricsCards'
import { SalesRevenueChart } from '@/components/admin/SalesRevenueChart'
import { CustomerStatisticsChart } from '@/components/admin/CustomerStatisticsChart'
import { DistributionMap } from '@/components/admin/DistributionMap'
import { TopProductsTable } from '@/components/admin/TopProductsTable'
import { ThemeTest } from '@/components/admin/ThemeTest'

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F7E6CA]">
      <AdminSidebar />

      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <DashboardHeader />

        {/* Content */}
        <div className="p-6">
          {/* Dashboard Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#005500]">
              Dashboard
            </h1>
          </div>

          {/* Metrics Cards */}
          <div className="mb-8">
            <MetricsCards />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SalesRevenueChart />
            <CustomerStatisticsChart />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistributionMap />
            <TopProductsTable />
          </div>
        </div>
        
        {/* Theme Test Component - Remove in production */}
        <ThemeTest />
      </main>
    </div>
  )
}
