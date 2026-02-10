"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronRight, Heart, Loader2, LogOut, Mail, MapPin, Pencil, Settings, Trash2, User, Package } from "lucide-react";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<Omit<Address, "id" | "isDefault">>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const storageKey = useMemo(() => {
    return user?.email ? `addresses:${user.email.toLowerCase()}` : null;
  }, [user]);

  const legacyStorageKey = useMemo(() => {
    return user ? `addresses:${user.id}` : null;
  }, [user]);

  const resetForm = () => {
    setForm({
      fullName: user?.name ?? "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    });
  };

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      if (legacyStorageKey && !localStorage.getItem(storageKey)) {
        const legacy = localStorage.getItem(legacyStorageKey);
        if (legacy) {
          localStorage.setItem(storageKey, legacy);
        }
      }

      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setAddresses([]);
        return;
      }
      const parsed = JSON.parse(raw) as Address[];
      setAddresses(Array.isArray(parsed) ? parsed : []);
    } catch {
      setAddresses([]);
    }
  }, [storageKey, legacyStorageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(addresses));
  }, [addresses, storageKey]);

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

  const openAdd = () => {
    setEditingId(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length > 0 && !next.some((a) => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: Omit<Address, "id" | "isDefault"> = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        line2: (form.line2 ?? "").trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
      };

      if (!payload.fullName || !payload.phone || !payload.line1 || !payload.city || !payload.state || !payload.postalCode || !payload.country) {
        return;
      }

      setAddresses((prev) => {
        const now = Date.now().toString(36);
        if (editingId) {
          return prev.map((a) => (a.id === editingId ? { ...a, ...payload } : a));
        }

        const nextAddress: Address = {
          id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
          ...payload,
          isDefault: prev.length === 0,
        };
        return [nextAddress, ...prev];
      });

      setDialogOpen(false);
      setEditingId(null);
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-10 sm:pt-36 sm:pb-12 bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">Account</div>
            <h1 className="font-birds text-4xl font-normal tracking-wide text-black sm:text-6xl capitalize">My Addresses</h1>
            <p className="max-w-2xl mx-auto text-sm text-gray-600 sm:text-base mt-2">
              Add, edit, and choose a default delivery address.
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
                  <Button variant="ghost" className="w-full justify-between h-12 text-gray-600 hover:text-black hover:bg-gray-50" asChild>
                    <Link href="/orders">
                      <span className="flex items-center gap-3">
                        <Package className="h-4 w-4" />
                        My Orders
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
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

                  <Button
                    variant="ghost"
                    className="w-full justify-between h-12 bg-black text-white hover:bg-gray-800 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className="h-4 w-4" />
                      Addresses
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/70" />
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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold text-black">Saved Addresses</CardTitle>
                    <CardDescription className="mt-1">Manage where you receive your orders.</CardDescription>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                      setEditingId(null);
                      resetForm();
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-black text-white hover:bg-gray-800" onClick={openAdd}>
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">
                          {editingId ? "Edit Address" : "Add New Address"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-xs uppercase font-bold text-gray-500">Full Name</Label>
                            <Input
                              id="fullName"
                              value={form.fullName}
                              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                              required
                              className="h-11 border-gray-200 focus:border-black focus:ring-black"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs uppercase font-bold text-gray-500">Phone</Label>
                            <Input
                              id="phone"
                              value={form.phone}
                              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                              required
                              className="h-11 border-gray-200 focus:border-black focus:ring-black"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="line1" className="text-xs uppercase font-bold text-gray-500">Address Line 1</Label>
                          <Input
                            id="line1"
                            value={form.line1}
                            onChange={(e) => setForm((p) => ({ ...p, line1: e.target.value }))}
                            required
                            className="h-11 border-gray-200 focus:border-black focus:ring-black"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="line2" className="text-xs uppercase font-bold text-gray-500">Address Line 2 (Optional)</Label>
                          <Input
                            id="line2"
                            value={form.line2 ?? ""}
                            onChange={(e) => setForm((p) => ({ ...p, line2: e.target.value }))}
                            className="h-11 border-gray-200 focus:border-black focus:ring-black"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-xs uppercase font-bold text-gray-500">City</Label>
                            <Input
                              id="city"
                              value={form.city}
                              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                              required
                              className="h-11 border-gray-200 focus:border-black focus:ring-black"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state" className="text-xs uppercase font-bold text-gray-500">State</Label>
                            <Input
                              id="state"
                              value={form.state}
                              onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                              required
                              className="h-11 border-gray-200 focus:border-black focus:ring-black"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="postalCode" className="text-xs uppercase font-bold text-gray-500">Postal Code</Label>
                            <Input
                              id="postalCode"
                              value={form.postalCode}
                              onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))}
                              required
                              className="h-11 border-gray-200 focus:border-black focus:ring-black"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country" className="text-xs uppercase font-bold text-gray-500">Country</Label>
                            <Input
                              id="country"
                              value={form.country}
                              onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                              required
                              className="h-11 border-gray-200 focus:border-black focus:ring-black"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-4">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setDialogOpen(false);
                            }}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSaving} className="bg-black text-white hover:bg-gray-800">
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
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {addresses.length === 0 ? (
                  <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-8 text-center text-gray-500">
                    <div className="flex justify-center mb-4">
                      <MapPin className="h-12 w-12 text-gray-300" />
                    </div>
                    <p className="font-medium text-black">No saved addresses</p>
                    <p className="text-sm mt-1">Add an address to use it at checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="group relative rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow bg-white">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-lg text-black">{addr.fullName}</span>
                              {addr.isDefault && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-0.5 text-xs font-medium text-white">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">{addr.phone}</div>
                            <div className="text-sm text-gray-500 mt-2 leading-relaxed">
                              {addr.line1}
                              {addr.line2 && <><br />{addr.line2}</>}
                              <br />
                              {addr.city}, {addr.state} {addr.postalCode}
                              <br />
                              {addr.country}
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 justify-end md:justify-start">
                            {!addr.isDefault && (
                              <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)} className="h-8 justify-start text-xs uppercase tracking-wide">
                                Set Default
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => openEdit(addr)} className="h-8 justify-start text-xs uppercase tracking-wide">
                              <Pencil className="mr-2 h-3 w-3" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(addr.id)}
                              className="h-8 justify-start text-xs uppercase tracking-wide text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-3 w-3" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
