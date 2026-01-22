"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, LogOut, Settings, MapPin, Heart, ChevronRight, User } from "lucide-react";

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
    <div className="min-h-screen pt-20 pb-10 sm:pt-24 sm:pb-12" style={{ backgroundColor: "#FDF7F1" }}>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground">ACCOUNT</div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">My Orders</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Track orders, view invoices, and manage returns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Card className="border-amber-200/60 dark:border-amber-900/40">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-amber-200/60 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/15">
                    <Image
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=amber&color=fff`}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Hello</div>
                    <div className="truncate font-medium text-foreground">{user.name}</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-1">
                  <Button
                    variant="secondary"
                    className="w-full justify-between bg-amber-50/70 text-foreground hover:bg-amber-50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      My Orders
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="/settings">
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="/profile">
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile Information
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="/addresses">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Manage Addresses
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="/wishlist">
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        My Wishlist
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </Button>
                </div>

                <Separator className="my-4" />

                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <Card className="border-amber-200/60 dark:border-amber-900/40">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-lg">Order History</CardTitle>
                <CardDescription>Your recent purchases will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">No orders yet</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        When you place an order, it will show up here with tracking and invoice options.
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/shop">Start Shopping</Link>
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
