"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, MapPin, Pencil, Plus, User, Package,
  Heart, Settings, LogOut, Menu, X, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from "next/font/google";

import { BackToHomeButton } from "@/components/ui/BackToHomeButton";

const inter = Inter({ subsets: ["latin"] });

type AddressForm = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default function AddressesPage() {
  const { user, updateUser, token, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Initialize form
  const [form, setForm] = useState<AddressForm>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  // Populate form data
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.name || "",
        phone: user.phoneNumber || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zip: user.address?.zip || "",
        country: user.address?.country || "India",
      });
    }
  }, [user, dialogOpen]);

  // Auth redirect
  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Body Scroll Lock for Mobile Drawer
  useEffect(() => {
    if (isAccountDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isAccountDrawerOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/address", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        }),
      });

      if (response.ok) {
        // Update local context
        updateUser({
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country
          }
        });
        setDialogOpen(false);
      } else {
        alert("Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("An error occurred while saving the address.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const hasAddress = user.address && (user.address.street || user.address.city);

  return (
    <div className={`min-h-screen bg-white flex ${inter.className}`}>

      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:flex flex-col w-64 pt-12 pb-8 px-0 border-r border-gray-200">
        <div className="px-8 mb-8 flex items-center gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-gray-100 transition-all duration-200"
            style={{ 
              width: '20px', 
              height: '20px', 
              padding: '0',
              margin: '0',
              minWidth: '20px',
              minHeight: '20px',
              maxWidth: '20px',
              maxHeight: '20px',
              boxSizing: 'border-box'
            }}
          >
            <ChevronLeft className="w-2.5 h-2.5 text-black" strokeWidth={3} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Profile</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {/* User Info Section */}
          <div className="mb-6">
            <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
              Account
            </div>
            <Link href="/profile" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium text-sm">User Info</span>
            </Link>
          </div>

          {/* Orders Section */}
          <div className="mb-6">
            <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
              Shopping
            </div>
            <Link href="/orders" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
              <Package className="w-5 h-5" />
              <span className="font-medium text-sm">Orders</span>
            </Link>

            <Link href="/wishlist" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="font-medium text-sm">Wishlist</span>
            </Link>
          </div>

          {/* Settings Section */}
          <div>
            <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
              Settings
            </div>
            {/* Active Link: Addresses */}
            <div className="flex items-center gap-4 px-8 py-3 text-black relative bg-gray-100">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-black rounded-r-md" />
              <MapPin className="w-5 h-5" />
              <span className="font-medium text-sm">Addresses</span>
            </div>

            <Link href="/settings" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm">Settings</span>
            </Link>
          </div>
        </nav>

        <div className="px-8 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-gray-500 hover:text-gray-700 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Log out</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-6 lg:px-10 lg:py-8 overflow-y-auto">

        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsAccountDrawerOpen(true)}>
              <Menu className="h-6 w-6 text-gray-900" />
            </Button>
            <span className="font-bold text-lg">My Addresses</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div className="max-w-6xl">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 pb-6">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Saved Addresses</CardTitle>
                <CardDescription className="mt-2 text-gray-500">Manage where you receive your orders</CardDescription>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    {hasAddress ? "Edit Address" : "Add New Address"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-white border border-gray-200 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">{hasAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-6">

                    {/* Full Name & Phone Row */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</Label>
                        <Input
                          id="fullName"
                          value={form.fullName}
                          disabled
                          className="h-12 bg-gray-50 border-gray-200 font-medium text-gray-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone</Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          disabled
                          className="h-12 bg-gray-50 border-gray-200 font-medium text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-3">
                      <Label htmlFor="street" className="text-sm font-semibold text-gray-700">Street Address</Label>
                      <Input
                        id="street"
                        value={form.street}
                        onChange={(e) => setForm({ ...form, street: e.target.value })}
                        required
                        placeholder="House No, Street Name"
                        className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                      />
                    </div>

                    {/* City & State Row */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="city" className="text-sm font-semibold text-gray-700">City</Label>
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          required
                          className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="state" className="text-sm font-semibold text-gray-700">State</Label>
                        <Input
                          id="state"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          required
                          className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Zip & Country Row */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="zip" className="text-sm font-semibold text-gray-700">Postal Code</Label>
                        <Input
                          id="zip"
                          value={form.zip}
                          onChange={(e) => setForm({ ...form, zip: e.target.value })}
                          required
                          className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country</Label>
                        <Input
                          id="country"
                          value={form.country}
                          onChange={(e) => setForm({ ...form, country: e.target.value })}
                          required
                          className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end pt-6 gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        className="h-12 px-6 border-gray-200 text-gray-600 hover:text-black hover:border-black hover:bg-white transition-all duration-300 font-medium"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-12 px-6 bg-black hover:bg-gray-800 text-white rounded-lg shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Address"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              {hasAddress ? (
                <div className="rounded-xl border border-gray-200 p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-xl text-gray-900">{user.name}</h3>
                        <span className="bg-green-100 text-green-800 border border-green-200 text-xs px-3 py-1.5 rounded-full font-bold">Default</span>
                      </div>
                      <p className="text-gray-500 font-medium">{user.phoneNumber}</p>
                      <div className="text-sm text-gray-500 mt-4 space-y-1">
                        <p className="font-medium">{user.address?.street}</p>
                        <p className="font-medium">{user.address?.city}, {user.address?.state} {user.address?.zip}</p>
                        <p className="font-medium">{user.address?.country}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                        className="flex-1 sm:flex-none border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-white transition-all duration-300 font-medium"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No address added</h3>
                  <p className="text-gray-500 mb-8 font-medium">Add a shipping address to speed up checkout.</p>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Account Management Drawer (Mobile) */}
      <AnimatePresence>
        {isAccountDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccountDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
            />

            {/* Drawer Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-2xl z-[101] flex flex-col lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent uppercase tracking-widest">Account</h2>
                <button
                  onClick={() => setIsAccountDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-2">
                  {[
                    { href: '/profile', icon: User, label: 'Profile' },
                    { href: '/orders', icon: Package, label: 'Orders' },
                    { href: '/wishlist', icon: Heart, label: 'Wishlist' },
                    { href: '/addresses', icon: MapPin, label: 'Addresses', active: true },
                    { href: '/settings', icon: Settings, label: 'Settings' }
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsAccountDrawerOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${link.active
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <link.icon className="h-5 w-5" strokeWidth={link.active ? 2.5 : 2} />
                      <span className="text-xs font-bold uppercase tracking-[0.2em]">{link.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all duration-300"
                >
                  <LogOut size={16} strokeWidth={2.5} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}