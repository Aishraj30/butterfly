"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, LogOut, Settings, MapPin, Heart, ChevronRight, User, Package } from "lucide-react";

export default function OrdersPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-600 mt-1">Track orders, view invoices, and manage returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-2">
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
                    className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-100 text-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4" />
                      <span className="text-sm font-medium">Orders</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">Wishlist</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  
                  <Link
                    href="/addresses"
                    className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">Addresses</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  
                  <Separator className="my-4" />
                  
                  <Link
                    href="/profile"
                    className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
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
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Order History</CardTitle>
                <CardDescription className="mt-1">View and track your recent orders</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your order history here.</p>
                  <Button asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Start Shopping
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Navigation */}
            <div className="mt-8 sm:hidden">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" asChild className="h-12">
                      <Link href="/profile" className="flex items-center justify-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-12">
                      <Link href="/wishlist" className="flex items-center justify-center gap-2">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-12">
                      <Link href="/addresses" className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Addresses
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-12">
                      <Link href="/settings" className="flex items-center justify-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
