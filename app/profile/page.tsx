"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, LogOut, Camera, Settings, MapPin, Heart, ChevronRight, Package, Edit3, ShoppingBag, CreditCard, Bell, Shield } from "lucide-react";
import Image from "next/image";
import { BackToHomeButton } from "@/components/ui/BackToHomeButton";



export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { user, logout, updateUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(null);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await updateUser({ name, email, avatar: avatarPreview || undefined });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setAvatarPreview(null);
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <BackToHomeButton variant="elegant" />
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="hidden sm:flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
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
                  <div className="relative inline-block mb-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={
                          avatarPreview ||
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`
                        }
                        alt={user.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 p-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-md">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                <Separator className="mb-6" />

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  <Link
                    href="/orders"
                    className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Personal Information</CardTitle>
                    <CardDescription className="mt-1">Update your personal details and contact information</CardDescription>
                  </div>
                  <div className="sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {message && (
                  <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-8">
                  {/* Mobile Avatar Upload */}
                  <div className="sm:hidden text-center mb-6">
                    <div className="relative inline-block">
                      <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={
                            avatarPreview ||
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`
                          }
                          alt={user.name}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      {isEditing && (
                        <label className="absolute bottom-1 right-1 p-1.5 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-md">
                          <Camera className="h-3 w-3" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing || isSubmitting}
                        className="h-11 border-gray-300 focus:border-black focus:ring-black"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing || isSubmitting}
                        className="h-11 border-gray-300 focus:border-black focus:ring-black"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                      <Input
                        type="tel"
                        value={user.phoneNumber || ''}
                        disabled={!isEditing || isSubmitting}
                        className="h-11 border-gray-300 focus:border-black focus:ring-black"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                        <Input
                          value={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                          disabled
                          className="h-11 bg-gray-50 border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                        <Input
                          value={user.role === 'admin' ? 'Administrator' : 'Customer'}
                          disabled
                          className="h-11 bg-gray-50 border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Status</Label>
                        <Input
                          value="Active"
                          disabled
                          className="h-11 bg-gray-50 border-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                            <p className="text-xs text-gray-600">Receive order updates and promotions</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                            <p className="text-xs text-gray-600">Receive mobile app notifications</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setAvatarPreview(null);
                          setName(user.name);
                          setEmail(user.email);
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
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
                      <Link href="/orders" className="flex items-center justify-center gap-2">
                        <Package className="h-4 w-4" />
                        Orders
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
