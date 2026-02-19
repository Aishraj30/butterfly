'use client'

const regionData = [
  { name: 'Asia', percentage: 90, color: 'bg-black' },
  { name: 'America', percentage: 30, color: 'bg-gray-600' },
  { name: 'Europe', percentage: 40, color: 'bg-gray-400' },
  { name: 'Others', percentage: 25, color: 'bg-gray-300' },
]

export function DistributionMap() {
  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-4 lg:p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Distribution Maps
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Geographic distribution
        </p>
      </div>

      {/* World Map Placeholder */}
      <div className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-6">
        {/* Simple world map representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Asia */}
            <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-20 bg-black/30 rounded-lg border-2 border-black"></div>
            </div>

            {/* America */}
            <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-24 bg-gray-600/30 rounded-lg border-2 border-gray-600"></div>
            </div>

            {/* Europe */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-8 bg-gray-400/30 rounded-lg border-2 border-gray-400"></div>
            </div>

            {/* Others */}
            <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-gray-300/30 rounded-lg border-2 border-gray-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Distribution by Region
        </h3>
        {regionData.map((region) => (
          <div key={region.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${region.color}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {region.name}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {region.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
