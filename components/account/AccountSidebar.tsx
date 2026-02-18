"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, Heart, MapPin, User, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AccountSidebar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!user) return null;

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <Card className="sticky top-8 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl ring-1 ring-black/5">
            <CardContent className="p-6">
                {/* Profile Summary */}
                <div className="text-center mb-6">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden border-4 border-white/60 shadow-xl mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200">
                        <Image
                            src={
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`
                            }
                            alt={user.name}
                            width={96}
                            height={96}
                            className="object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{user.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{user.email}</p>
                </div>

                <Separator className="mb-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    <Link
                        href="/orders"
                        className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 font-medium group ${
                            isActive('/orders') 
                                ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg' 
                                : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 backdrop-blur-sm'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                                isActive('/orders') 
                                    ? 'bg-white/20' 
                                    : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                                <Package className="h-4 w-4" />
                            </div>
                            <span className="text-sm">Orders</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-colors ${
                            isActive('/orders') 
                                ? 'text-white' 
                                : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                    </Link>

                    <Link
                        href="/wishlist"
                        className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 font-medium group ${
                            isActive('/wishlist') 
                                ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg' 
                                : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 backdrop-blur-sm'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                                isActive('/wishlist') 
                                    ? 'bg-white/20' 
                                    : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                                <Heart className="h-4 w-4" />
                            </div>
                            <span className="text-sm">Wishlist</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-colors ${
                            isActive('/wishlist') 
                                ? 'text-white' 
                                : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                    </Link>

                    <Link
                        href="/addresses"
                        className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 font-medium group ${
                            isActive('/addresses') 
                                ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg' 
                                : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 backdrop-blur-sm'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                                isActive('/addresses') 
                                    ? 'bg-white/20' 
                                    : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                                <MapPin className="h-4 w-4" />
                            </div>
                            <span className="text-sm">Addresses</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-colors ${
                            isActive('/addresses') 
                                ? 'text-white' 
                                : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                    </Link>

                    <Separator className="my-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                    <Link
                        href="/profile"
                        className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 font-medium group ${
                            isActive('/profile') 
                                ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg' 
                                : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 backdrop-blur-sm'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                                isActive('/profile') 
                                    ? 'bg-white/20' 
                                    : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                                <User className="h-4 w-4" />
                            </div>
                            <span className="text-sm">Profile</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-colors ${
                            isActive('/profile') 
                                ? 'text-white' 
                                : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                    </Link>

                    <Link
                        href="/settings"
                        className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 font-medium group ${
                            isActive('/settings') 
                                ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg' 
                                : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 backdrop-blur-sm'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                                isActive('/settings') 
                                    ? 'bg-white/20' 
                                    : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                                <Settings className="h-4 w-4" />
                            </div>
                            <span className="text-sm">Settings</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-colors ${
                            isActive('/settings') 
                                ? 'text-white' 
                                : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                    </Link>
                </nav>

                <Separator className="my-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* Logout Button */}
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-red-200/60 bg-red-50/30 text-red-600 hover:bg-red-100/50 hover:text-red-700 hover:border-red-300/80 backdrop-blur-sm transition-all duration-300 font-medium"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </CardContent>
        </Card>
    );
}
