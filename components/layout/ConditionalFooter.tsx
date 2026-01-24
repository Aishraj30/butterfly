'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function ConditionalFooter() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const isCatalog = pathname === '/catalog'
    const isProduct = pathname?.startsWith('/product')

    if (isAdmin || isCatalog || isProduct) {
        return null
    }

    return <Footer />
}
