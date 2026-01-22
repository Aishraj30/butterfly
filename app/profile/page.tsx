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
import { Loader2, User, Mail, LogOut, Camera, Settings, MapPin, Heart, ChevronRight } from "lucide-react";
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
    <div
      className="min-h-screen pt-20 pb-10 sm:pt-24 sm:pb-12"
      style={{ backgroundColor: "#FDF7F1" }}
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground">ACCOUNT</div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">My Profile</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage your personal information and preferences
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
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=amber&color=fff`
                      }
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
                  <Button
                    variant="secondary"
                    className="w-full justify-between bg-amber-50/70 text-foreground hover:bg-amber-50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile Information
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="font-serif text-lg">Personal Information</CardTitle>
                    <CardDescription>Update your name and profile photo</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="link" className="h-auto p-0" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-amber-200 shadow-sm dark:border-amber-900/50">
                      <Image
                        src={
                          avatarPreview ||
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.name}&background=amber&color=fff`
                        }
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    {isEditing ? (
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-amber-200/60 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-amber-50/50 dark:border-amber-900/40 dark:hover:bg-amber-950/15">
                        <Camera className="h-4 w-4" />
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing || isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing || isSubmitting}
                      />
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Button type="button" variant="outline" onClick={() => {
                        setIsEditing(false);
                        setName(user.name);
                        setEmail(user.email);
                        setAvatarPreview(null);
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
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
                  ) : null}
                </form>
              </CardContent>
            </Card>

            <Card className="border-amber-200/60 dark:border-amber-900/40">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-lg">FAQs</CardTitle>
                <CardDescription>Common questions about updating your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      What happens when I update my email address?
                    </AccordionTrigger>
                    <AccordionContent>
                      Your account will use the updated email address for sign-in and communication.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Will updating my profile affect my order history?
                    </AccordionTrigger>
                    <AccordionContent>
                      No. Your orders and account history remain unchanged.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How do I change my profile photo?
                    </AccordionTrigger>
                    <AccordionContent>
                      Click Edit in Personal Information, then choose a new image and save changes.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
