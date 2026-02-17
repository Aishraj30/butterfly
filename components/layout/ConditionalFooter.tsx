'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function ConditionalFooter() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const isCatalog = pathname === '/catalog'
    const isSale = pathname?.startsWith('/sale')
    const isNewArrival = pathname?.startsWith('/new-arrival')
    const isWishlist = pathname?.startsWith('/wishlist')

    if (isAdmin || isCatalog || isSale || isNewArrival || isWishlist) {
        return null
    }

    return <Footer />
}
