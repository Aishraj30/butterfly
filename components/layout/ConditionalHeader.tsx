'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

export function ConditionalHeader() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    const isOrders = pathname?.startsWith('/orders')

    if (isAdmin || isOrders) {
        return null
    }

    return <Header />
}
