'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

export function ConditionalHeader() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    const isOrders = pathname?.startsWith('/orders')
    const isWishlist = pathname?.startsWith('/wishlist')
    const isProfile = pathname?.startsWith('/profile')
    const isAddresses = pathname?.startsWith('/addresses')
    const isCheckout = pathname?.startsWith('/checkout')
    const isHeader = pathname?.startsWith('/header')

    if (isAdmin || isOrders || isWishlist || isProfile || isAddresses || isCheckout || isHeader) {
        return null
    }

    return <Header />
}
