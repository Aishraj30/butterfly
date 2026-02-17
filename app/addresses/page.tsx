"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Pencil, Trash2, Plus } from "lucide-react";
import { AccountSidebar } from "@/components/account/AccountSidebar";


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
  const { user, updateUser, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with empty values or user data if available
  const [form, setForm] = useState<AddressForm>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  // Populate form data when user data is available or modal opens
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

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    // Handled by Sidebar
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

  const hasAddress = user.address && (user.address.street || user.address.city);

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
        const data = await response.json();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your shipping addresses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Saved Addresses</CardTitle>
                  <CardDescription className="mt-1">Manage where you receive your orders</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {hasAddress ? "Edit Address" : "Add New Address"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{hasAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={form.fullName}
                            disabled // Name comes from profile
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={form.phone}
                            disabled // Phone comes from profile
                            className="bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={form.street}
                          onChange={(e) => setForm({ ...form, street: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="zip">Postal Code</Label>
                          <Input
                            id="zip"
                            value={form.zip}
                            onChange={(e) => setForm({ ...form, zip: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 gap-3">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
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
              <CardContent>
                {hasAddress ? (
                  <div className="rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">Default</span>
                        </div>
                        <p className="text-gray-600">{user.phoneNumber}</p>
                        <div className="text-sm text-gray-500 mt-2">
                          <p>{user.address?.street}</p>
                          <p>{user.address?.city}, {user.address?.state} {user.address?.zip}</p>
                          <p>{user.address?.country}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No address added</h3>
                    <p className="text-gray-500 mb-6">Add a shipping address to speed up checkout.</p>
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
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
