'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    User, Package, Heart, MapPin, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AccountSidebarProps {
    activePage?: 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';
}

export function AccountSidebar({ activePage }: AccountSidebarProps) {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const navigationItems = [
        { href: '/profile', icon: User, label: 'PROFILE' },
        { href: '/orders', icon: Package, label: 'ORDERS' },
        { href: '/wishlist', icon: Heart, label: 'WISHLIST' },
        { href: '/addresses', icon: MapPin, label: 'ADDRESSES' }
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 pt-8 pb-6 px-0 border-r border-gray-200 lg:sticky lg:top-0 h-screen bg-white">
            {/* Header */}
            <div className="px-6 mb-6">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight mb-6">ACCOUNT</h1>
                
                {/* Profile Summary */}
                <div className="text-center">
                    <div className="relative h-16 w-16 mx-auto mb-3">
                        <Image
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=000&color=fff`}
                            alt={user?.name || 'User'}
                            width={64}
                            height={64}
                            className="rounded-full object-cover border-2 border-white shadow-md"
                        />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
                        {user?.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                        {user?.email}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6">
                <div className="space-y-1">
                    {navigationItems.map((link) => {
                        const isActive = link.href === `/${activePage}`;
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? 'bg-black text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <link.icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-xs font-bold uppercase tracking-[0.1em]">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div className="px-6 mt-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all duration-300"
                >
                    <LogOut size={16} strokeWidth={2.5} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
