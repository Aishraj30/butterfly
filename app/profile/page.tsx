"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Loader2, User, Mail, LogOut, Camera, Settings, MapPin,
    Heart, ChevronRight, Package, Edit3, Shield, Bell, LogIn, ChevronLeft, Menu, X
} from "lucide-react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

import { BackToHomeButton } from "@/components/ui/BackToHomeButton";

export default function ProfilePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className={`min-h-screen bg-white flex ${inter.className}`}>

            {/* --- Sidebar (Left Navigation) --- */}
            <aside className="hidden lg:flex flex-col w-64 pt-12 pb-8 px-0 border-r border-gray-200 lg:sticky lg:top-0 h-screen">
                <div className="px-8 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="lg:hidden group relative inline-flex items-center justify-center w-8 h-8 rounded-full border border-black bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-sm"
                        >
                            <Menu className="w-4 h-4 text-black" strokeWidth={2} />
                        </button>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="hidden lg:flex group relative inline-flex items-center justify-center w-8 h-8 rounded-full border border-black bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4 text-black transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Profile</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-black bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-sm"
                    >
                        <LogOut className="w-4 h-4 text-black" strokeWidth={2} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1">
                    {/* User Info Section */}
                    <div className="mb-6">
                        <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
                            Account
                        </div>
                        {/* Active Link: Profile */}
                        <div className="flex items-center gap-4 px-8 py-3 text-black relative bg-gray-100">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-black rounded-r-md" />
                            <User className="w-5 h-5" />
                            <span className="font-medium text-sm">User Info</span>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="mb-6">
                        <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
                            Shopping
                        </div>
                        {/* Inactive Links */}
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
                        <Link href="/addresses" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium text-sm">Addresses</span>
                        </Link>

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
                    <span className="font-bold text-lg">My Profile</span>
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                        <LogOut className="h-5 w-5 text-gray-500" />
                    </Button>
                </div>

                <div className="max-w-6xl">

                    {/* Header / Avatar Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-gray-100">
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
                            {/* Black edit dot (decorative) */}
                            {isEditing && (
                                <label className="absolute bottom-1 right-1 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-white text-white cursor-pointer hover:bg-gray-800 transition-colors shadow-md">
                                    <Camera className="w-4 h-4" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <div className="text-center md:text-left pt-2 flex-1">
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-400 text-sm mt-1">{user.role === 'admin' ? 'Administrator' : 'Valued Customer'}</p>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="mt-4 md:mt-0 border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 rounded-xl"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Messages */}
                    {message && (
                        <Alert className="mb-8 bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-10">

                        {/* Personal Information Group */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-xs text-gray-400 font-medium ml-1">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing || isSubmitting}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-700 disabled:opacity-70"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-xs text-gray-400 font-medium ml-1">Email Address</Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing || isSubmitting}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-700 disabled:opacity-70"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs text-gray-400 font-medium ml-1">Phone Number</Label>
                                    <Input
                                        value={user.phoneNumber || ''}
                                        placeholder="Not provided"
                                        disabled={!isEditing || isSubmitting}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-700 disabled:opacity-70"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs text-gray-400 font-medium ml-1">Location</Label>
                                    <Input
                                        placeholder="e.g. New York, USA"
                                        disabled={!isEditing || isSubmitting}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-700 disabled:opacity-70"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferences Group (Visual Only for this demo) */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Notifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg text-black shadow-sm">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Email Updates</span>
                                    </div>
                                    <div className="h-5 w-9 bg-black rounded-full relative cursor-pointer">
                                        <div className="h-3 w-3 bg-white rounded-full absolute top-1 right-1" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg text-black shadow-sm">
                                            <Bell className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                                    </div>
                                    <div className="h-5 w-9 bg-gray-300 rounded-full relative cursor-pointer">
                                        <div className="h-3 w-3 bg-white rounded-full absolute top-1 left-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-12 px-10 bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95"
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
                </div>

                {/* Mobile FAB Menu (Mimicking Navigation) */}
                <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
                    <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
                        <Link href="/orders"><Package className="h-5 w-5" /></Link>
                    </Button>
                    <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
                        <Link href="/wishlist"><Heart className="h-5 w-5" /></Link>
                    </Button>
                </div>

            </main>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 z-50 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <div 
                        className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-8 mb-8 flex items-center justify-between pt-12">
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Profile</h1>
                            <button
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className="flex items-center justify-center w-8 h-8 rounded-full border border-black bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-sm"
                            >
                                <X className="w-4 h-4 text-black" strokeWidth={2} />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-1">
                            {/* User Info Section */}
                            <div className="mb-6">
                                <div className="px-8 py-2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">
                                    Account
                                </div>
                                {/* Active Link: Profile */}
                                <div className="flex items-center gap-4 px-8 py-3 text-black relative bg-gray-100">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-black rounded-r-md" />
                                    <User className="w-5 h-5" />
                                    <span className="font-medium text-sm">User Info</span>
                                </div>
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
                                <Link href="/addresses" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-medium text-sm">Addresses</span>
                                </Link>

                                <Link href="/settings" className="flex items-center gap-4 px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                                    <Settings className="w-5 h-5" />
                                    <span className="font-medium text-sm">Settings</span>
                                </Link>
                            </div>
                        </nav>

                        <div className="px-8 mt-auto pb-8">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 text-gray-500 hover:text-gray-700 transition-colors w-full"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium text-sm">Log out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}