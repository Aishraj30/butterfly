'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

export function ConditionalHeader() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    if (isAdmin) {
        return null
    }

    return <Header />
}
