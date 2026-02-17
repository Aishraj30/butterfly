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
        <Card className="sticky top-8">
            <CardContent className="p-4">
                {/* Profile Summary */}
                <div className="text-center mb-6">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                        <Image
                            src={
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`
                            }
                            alt={user.name}
                            width={80}
                            height={80}
                            className="object-cover"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                <Separator className="mb-6" />

                {/* Navigation Menu */}
                <nav className="space-y-1">
                    <Link
                        href="/orders"
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${isActive('/orders') ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Package className="h-4 w-4" />
                            <span className="text-sm">Orders</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${isActive('/orders') ? 'text-gray-900' : 'text-gray-400'}`} />
                    </Link>

                    <Link
                        href="/wishlist"
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${isActive('/wishlist') ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">Wishlist</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${isActive('/wishlist') ? 'text-gray-900' : 'text-gray-400'}`} />
                    </Link>

                    <Link
                        href="/addresses"
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${isActive('/addresses') ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">Addresses</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${isActive('/addresses') ? 'text-gray-900' : 'text-gray-400'}`} />
                    </Link>

                    <Separator className="my-4" />

                    <Link
                        href="/profile"
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${isActive('/profile') ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4" />
                            <span className="text-sm">Profile</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${isActive('/profile') ? 'text-gray-900' : 'text-gray-400'}`} />
                    </Link>

                    <Link
                        href="/settings"
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${isActive('/settings') ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Settings className="h-4 w-4" />
                            <span className="text-sm">Settings</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${isActive('/settings') ? 'text-gray-900' : 'text-gray-400'}`} />
                    </Link>
                </nav>

                <Separator className="my-6" />

                {/* Logout Button */}
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </CardContent>
        </Card>
    );
}
