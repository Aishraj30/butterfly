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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, LogOut, Camera, Settings, MapPin, Heart, ChevronRight, Package } from "lucide-react";
import Image from "next/image";

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
    if (!user) return;
    setMessage(null);
    setIsSubmitting(true);

    try {
      updateUser({
        name,
        email,
        avatar: avatarPreview ?? user.avatar,
      });
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
    <div className="min-h-screen pt-32 pb-10 sm:pt-36 sm:pb-12 bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">Account</div>
            <h1 className="font-birds text-4xl font-normal tracking-wide text-black sm:text-6xl capitalize">My Profile</h1>
            <p className="max-w-2xl mx-auto text-sm text-gray-600 sm:text-base mt-2">
              Manage your personal information and preferences
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
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`
                      }
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
                  <Button variant="ghost" className="w-full justify-between h-12 text-gray-600 hover:text-black hover:bg-gray-50" asChild>
                    <Link href="/addresses">
                      <span className="flex items-center gap-3">
                        <MapPin className="h-4 w-4" />
                        Addresses
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-12 bg-black text-white hover:bg-gray-800 hover:text-white mt-2"
                  >
                    <span className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      Profile Settings
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/70" />
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

          {/* Main Content Area */}
          <div className="space-y-6 lg:col-span-8">
            <Card className="border border-gray-100 shadow-sm rounded-xl">
              <CardHeader className="pb-4 border-b border-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-black">Personal Details</CardTitle>
                    <CardDescription className="mt-1">Update your personal information</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-gray-200"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {message && (
                  <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-8">
                  <div className="flex flex-col sm:flex-row gap-8 items-start">
                    <div className="relative group">
                      <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-100 shadow-sm">
                        <Image
                          src={
                            avatarPreview ||
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`
                          }
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 p-1.5 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-md">
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

                    <div className="flex-1 w-full space-y-4">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wide text-gray-500">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing || isSubmitting}
                            className="h-11 border-gray-200 focus:border-black focus:ring-black"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-gray-500">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing || isSubmitting}
                            className="h-11 border-gray-200 focus:border-black focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user.name);
                          setEmail(user.email);
                          setAvatarPreview(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black text-white hover:bg-gray-800 min-w-[140px]"
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
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats or other info could go here, for now removing the FAQ to clean up */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
