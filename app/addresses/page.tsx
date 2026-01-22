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
import { Check, ChevronRight, Heart, Loader2, LogOut, Mail, MapPin, Pencil, Settings, Trash2, User } from "lucide-react";

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
    <div className="min-h-screen pt-20 pb-10 sm:pt-24 sm:pb-12" style={{ backgroundColor: "#FDF7F1" }}>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground">ACCOUNT</div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Manage Addresses</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Add, edit, and choose a default delivery address.
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
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="/orders">
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        My Orders
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
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

                  <Button
                    variant="secondary"
                    className="w-full justify-between bg-amber-50/70 text-foreground hover:bg-amber-50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Manage Addresses
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="font-serif text-lg">Saved Addresses</CardTitle>
                    <CardDescription>Manage where you receive your orders.</CardDescription>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                      setEditingId(null);
                      resetForm();
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={openAdd}>
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="font-serif">
                          {editingId ? "Edit Address" : "Add New Address"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={form.fullName}
                              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={form.phone}
                              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="line1">Address Line 1</Label>
                          <Input
                            id="line1"
                            value={form.line1}
                            onChange={(e) => setForm((p) => ({ ...p, line1: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                          <Input
                            id="line2"
                            value={form.line2 ?? ""}
                            onChange={(e) => setForm((p) => ({ ...p, line2: e.target.value }))}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={form.city}
                              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={form.state}
                              onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              value={form.postalCode}
                              onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={form.country}
                              onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setDialogOpen(false);
                            }}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="text-sm font-medium text-foreground">No saved addresses</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Add an address to use it at checkout.
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="rounded-lg border bg-card p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-semibold text-foreground">{addr.fullName}</div>
                              {addr.isDefault ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-foreground">
                                  <Check className="h-3.5 w-3.5" />
                                  Default
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">{addr.phone}</div>
                            <div className="mt-3 text-sm text-foreground">
                              {addr.line1}
                              {addr.line2 ? `, ${addr.line2}` : ""}
                            </div>
                            <div className="mt-1 text-sm text-foreground">
                              {addr.city}, {addr.state} {addr.postalCode}
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">{addr.country}</div>
                          </div>
                          <div className="flex shrink-0 flex-col gap-2">
                            {!addr.isDefault ? (
                              <Button variant="outline" size="sm" onClick={() => handleSetDefault(addr.id)}>
                                Set Default
                              </Button>
                            ) : null}
                            <Button variant="outline" size="sm" onClick={() => openEdit(addr)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(addr.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
