'use client'

import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { MessageSquare, Mail, Send, User } from 'lucide-react'

const messages = [
  {
    id: 1,
    sender: 'John Doe',
    email: 'john@example.com',
    subject: 'Product Inquiry',
    message: 'Hi, I wanted to ask about the availability of the new summer collection.',
    time: '2 hours ago',
    read: false,
    type: 'inquiry'
  },
  {
    id: 2,
    sender: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Order Issue',
    message: 'My order #12345 hasn\'t arrived yet. Can you check the status?',
    time: '5 hours ago',
    read: true,
    type: 'support'
  },
  {
    id: 3,
    sender: 'Mike Johnson',
    email: 'mike@example.com',
    subject: 'Return Request',
    message: 'I would like to return the jacket I purchased last week.',
    time: '1 day ago',
    read: true,
    type: 'return'
  },
  {
    id: 4,
    sender: 'Sarah Wilson',
    email: 'sarah@example.com',
    subject: 'Feedback',
    message: 'Great service! The products exceeded my expectations.',
    time: '2 days ago',
    read: true,
    type: 'feedback'
  }
]

export default function MessagesPage() {
  return (
    <main className="flex-1">
      <DashboardHeader />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer inquiries and support requests
          </p>
        </div>

        {/* Message Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <MessageSquare className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">150</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Mail className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Send className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <User className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">49</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Sender</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Message</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{message.sender}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{message.subject}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {message.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {message.message}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {message.time}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${message.read
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                        {message.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
