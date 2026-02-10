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
    <div className="min-h-screen pt-32 pb-10 sm:pt-36 sm:pb-12 bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">Account</div>
            <h1 className="font-birds text-4xl font-normal tracking-wide text-black sm:text-6xl capitalize">My Orders</h1>
            <p className="max-w-2xl mx-auto text-sm text-gray-600 sm:text-base mt-2">
              Track orders, view invoices, and manage returns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar / Navigation Card */}
          <div className="lg:col-span-4">
            <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-gray-50 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200">
                    <Image
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Welcome</div>
                    <div className="truncate font-semibold text-lg text-black">{user.name}</div>
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-12 bg-black text-white hover:bg-gray-800 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Package className="h-4 w-4" />
                      My Orders
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/70" />
                  </Button>

                  <Button variant="ghost" className="w-full justify-between h-12 text-gray-600 hover:text-black hover:bg-gray-50" asChild>
                    <Link href="/wishlist">
                      <span className="flex items-center gap-3">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-between h-12 text-gray-600 hover:text-black hover:bg-gray-50" asChild>
                    <Link href="/addresses">
                      <span className="flex items-center gap-3">
                        <MapPin className="h-4 w-4" />
                        Addresses
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-between h-12 text-gray-600 hover:text-black hover:bg-gray-50 mt-2" asChild>
                    <Link href="/profile">
                      <span className="flex items-center gap-3">
                        <User className="h-4 w-4" />
                        Profile Settings
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </Button>
                </div>

                <div className="p-4 border-t border-gray-100">
                  <Button variant="outline" onClick={handleLogout} className="w-full border-gray-200 hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <Card className="border border-gray-100 shadow-sm rounded-xl">
              <CardHeader className="pb-4 border-b border-gray-50">
                <CardTitle className="text-xl font-semibold text-black">Order History</CardTitle>
                <CardDescription>Your recent purchases will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">No orders yet</h3>
                      <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                        When you place an order, it will show up here with tracking and invoice options.
                      </p>
                    </div>
                    <Button asChild className="bg-black text-white hover:bg-gray-900 mt-2 px-8">
                      <Link href="/catalog">Start Shopping</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
