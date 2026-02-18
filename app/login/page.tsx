"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, User, LogIn, UserPlus, HelpCircle, LogOut } from "lucide-react";
import Image from "next/image";

// Using Inter as requested, it fits the clean dashboard look perfectly
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Using the provided banner images for the "Avatar" profile picture
const AVATAR_IMAGE = "https://res.cloudinary.com/dgpm72swx/image/upload/v1771400048/butterfly-couture/1771400047722-blob.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white flex ${inter.className}`}>
      
      {/* --- Sidebar (Left Navigation) --- */}
      <aside className="hidden lg:flex flex-col w-64 pt-12 pb-8 px-0 border-r border-gray-100">
        <div className="px-8 mb-12">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">User Profile</h1>
        </div>

        <nav className="flex-1 space-y-2">
            {/* Active State: Orange border left, orange icon/text */}
            <div className="flex items-center gap-4 px-8 py-3 text-orange-600 relative bg-orange-50/10">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-orange-500 rounded-r-md" />
                <LogIn className="w-5 h-5" />
                <span className="font-medium text-sm">Sign In</span>
            </div>

            {/* Inactive Links */}
            <Link href="/signup" className="flex items-center gap-4 px-8 py-3 text-gray-400 hover:text-gray-600 transition-colors">
                <UserPlus className="w-5 h-5" />
                <span className="font-medium text-sm">Register</span>
            </Link>

            <Link href="/forgot-password" className="flex items-center gap-4 px-8 py-3 text-gray-400 hover:text-gray-600 transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium text-sm">Forgot Password?</span>
            </Link>
        </nav>

        <div className="px-8 mt-auto">
             <Link href="/" className="flex items-center gap-4 text-red-500 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Back to Home</span>
            </Link>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        
        {/* Mobile Header (visible only on small screens) */}
        <div className="lg:hidden flex justify-between items-center mb-8">
            <span className="font-bold text-lg">Butterfly Couture</span>
            <Link href="/signup" className="text-orange-500 text-sm font-medium">Register</Link>
        </div>

        <div className="max-w-4xl mx-auto">
            {/* Profile Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-orange-100">
                        <Image 
                            src={AVATAR_IMAGE}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Orange edit dot (decorative) */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white text-white">
                        <User className="w-3 h-3" />
                    </div>
                </div>
                
                <div className="text-center md:text-left pt-2">
                    <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mt-1">Butterfly Couture Member</p>
                </div>
            </div>

            {/* Form Section */}
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-50 text-red-600 border-red-100 rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    
                    {/* Email Input */}
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-xs text-gray-400 font-medium ml-1">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sara.tancredi@gmail.com"
                            required
                            disabled={isSubmitting}
                            // Styling matches the image: Light gray bg, rounded corners, no harsh borders
                            className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-200 transition-all text-gray-700 placeholder:text-gray-400"
                        />
                    </div>

                     {/* Password Input */}
                    <div className="space-y-3">
                        <Label htmlFor="password" className="text-xs text-gray-400 font-medium ml-1">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={isSubmitting}
                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-200 transition-all text-gray-700 pr-12 placeholder:text-gray-400"
                            />
                             <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-gray-400 hover:text-orange-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Spacer for grid alignment if needed, or additional fields */}
                    <div className="hidden md:block"></div> 

                    {/* Submit Button Area */}
                     <div className="md:col-span-2 flex justify-end mt-8">
                         {/* Pill shaped orange button with shadow */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-lg shadow-orange-500/20 font-medium transition-all transform active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>

        {/* Floating Action Button (Mobile only) visual mimicry */}
        <div className="fixed bottom-8 right-8 lg:hidden">
             <Button size="icon" className="h-14 w-14 rounded-full bg-white text-black shadow-xl border border-gray-100">
                <LogIn className="h-6 w-6" />
             </Button>
        </div>

      </main>
    </div>
  );
}