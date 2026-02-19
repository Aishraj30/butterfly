'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

export function ConditionalHeader() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const isAuthPage = pathname === '/login' || pathname === '/signup'

    if (isAdmin || isAuthPage) {
        return null
    }

    return <Header />
}
