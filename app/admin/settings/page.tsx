import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Save, AlertCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-secondary border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
            <div>
              <h1 className="font-serif text-3xl font-bold text-primary">
                Settings
              </h1>
              <p className="text-foreground/60 text-sm mt-1">
                Manage store configuration and SEO settings
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
          {/* Store Settings */}
          <div className="bg-background border border-border rounded-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-foreground mb-6">
              Store Settings
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Butterfly Couture"
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="hello@butterflycouture.com"
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Description
                </label>
                <textarea
                  defaultValue="Luxury fashion redefined. Where elegance meets innovation."
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Currency
                  </label>
                  <select className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Timezone
                  </label>
                  <select className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>UTC</option>
                    <option>EST</option>
                    <option>PST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Language
                  </label>
                  <select className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
            </form>
          </div>

          {/* SEO Settings */}
          <div className="bg-background border border-border rounded-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-foreground mb-6">
              SEO Settings
            </h2>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Title (Homepage)
                </label>
                <input
                  type="text"
                  defaultValue="Butterfly Couture | Luxury Fashion"
                  maxLength={60}
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  60 characters recommended
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Description
                </label>
                <textarea
                  defaultValue="Discover exquisite butterfly-inspired luxury fashion collection. Premium couture pieces crafted with elegance and sophistication."
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  160 characters recommended
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  defaultValue="luxury fashion, couture, butterfly, elegant, premium"
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Generate Sitemap Automatically
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Enable Search Engine Indexing
                </label>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
              >
                <Save size={18} />
                Save SEO Settings
              </button>
            </form>
          </div>

          {/* Email Settings */}
          <div className="bg-background border border-border rounded-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-foreground mb-6">
              Email Settings
            </h2>

            <form className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 flex gap-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Email Integration Required
                  </p>
                  <p className="text-xs text-blue-800">
                    Connect your email service provider to send order confirmations and customer notifications.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  SMTP Server
                </label>
                <input
                  type="text"
                  placeholder="smtp.example.com"
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    placeholder="587"
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    From Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="noreply@butterflycouture.com"
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
              >
                <Save size={18} />
                Save Email Settings
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-sm p-6">
            <h2 className="font-semibold text-lg text-red-900 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-red-800 mb-4">
              These actions cannot be undone. Please proceed with caution.
            </p>
            <button className="px-6 py-2 bg-red-600 text-white font-medium rounded-sm hover:bg-red-700 transition-colors">
              Delete All Data
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
