'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function ConditionalFooter() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const isCatalog = pathname === '/catalog'
    const isProduct = pathname?.startsWith('/product')
    const isSale = pathname?.startsWith('/sale')
    const isNewArrival = pathname?.startsWith('/new-arrival')
    const isWishlist = pathname?.startsWith('/wishlist')

    if (isAdmin || isCatalog || isProduct || isSale || isNewArrival || isWishlist) {
        return null
    }

    return <Footer />
}
