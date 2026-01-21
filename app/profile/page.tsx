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
import { Loader2, User, Mail, Calendar, ShoppingBag, LogOut, Edit2, Camera } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { user, logout, isLoading: authLoading } = useAuth();
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
    setMessage(null);
    setIsSubmitting(true);

    try {
      // TODO: Implement profile update API
      // await updateProfile({ name, email, avatar: avatarPreview });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Profile Information
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Your personal details and account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Avatar */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {avatarPreview || user.name ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-200">
                          <Image
                            src={avatarPreview || `https://ui-avatars.com/api/?name=${user.name}&background=amber&color=fff`}
                            alt={user.name}
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
                          <User className="h-12 w-12 text-amber-600" />
                        </div>
                      )}
                      
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-amber-600 text-white p-2 rounded-full cursor-pointer hover:bg-amber-700">
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
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  {/* Name Field */}
                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  {/* Email Field */}
                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user.name);
                          setEmail(user.email);
                          setAvatarPreview(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>Your account activity and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <ShoppingBag className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">6</div>
                    <div className="text-sm text-gray-600">Months Active</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {user.role === "admin" ? "Admin" : "Premium"}
                    </div>
                    <div className="text-sm text-gray-600">Account Type</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and account management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 justify-start" asChild>
                    <Link href="/orders">
                      <ShoppingBag className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">My Orders</div>
                        <div className="text-xs text-gray-500">View order history</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-16 justify-start" asChild>
                    <Link href="/settings">
                      <User className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Account Settings</div>
                        <div className="text-xs text-gray-500">Preferences & security</div>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" className="h-16 justify-start" asChild>
                    <Link href="/addresses">
                      <Mail className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Shipping Addresses</div>
                        <div className="text-xs text-gray-500">Manage delivery info</div>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" className="h-16 justify-start" asChild>
                    <Link href="/wishlist">
                      <User className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Wishlist</div>
                        <div className="text-xs text-gray-500">Saved items</div>
                      </div>
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
