"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Inter } from "next/font/google";
import {
  Loader2, Package, User, Heart, MapPin, Settings, LogOut, Star, ChevronLeft
} from "lucide-react";
import { BackToHomeButton } from "@/components/ui/BackToHomeButton";
import { useToast } from "@/hooks/use-toast";

const inter = Inter({ subsets: ["latin"] });

export default function OrdersPage() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Return Modal State
  const [returnOpen, setReturnOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<any>(null);
  const [returnItem, setReturnItem] = useState<any>(null);
  const [returnReason, setReturnReason] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const openReturnModal = (order: any, item: any) => {
    setSelectedOrderForReturn(order);
    setReturnItem(item);
    setReturnReason("");
    setReturnOpen(true);
  };

  const handleReturnSubmit = async () => {
    if (!selectedOrderForReturn || !returnItem) return;

    setIsSubmittingReturn(true);
    try {
      const userId = user?.id || (user as any)?._id;
      if (!userId) return;

      const response = await fetch("/api/returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: selectedOrderForReturn.orderId,
          orderObjectId: selectedOrderForReturn._id,
          userId: userId,
          items: [{
            productId: typeof returnItem.productId === 'object' ? returnItem.productId._id : returnItem.productId,
            name: returnItem.name,
            quantity: returnItem.quantity,
            price: returnItem.price,
            size: returnItem.size,
            color: returnItem.color,
            reason: returnReason
          }],
          customerReason: returnReason
        })
      });

      if (response.ok) {
        setReturnOpen(false);
        toast({
          title: "Return Request Submitted",
          description: "We will review your request and get back to you shortly.",
        });
      } else {
        const errData = await response.json();
        toast({
          title: "Return Request Failed",
          description: errData.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting return request:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting your return.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const openReviewModal = (item: any) => {
    const pId = typeof item.productId === 'object' ? (item.productId as any)._id : item.productId;
    setSelectedItem({ ...item, productId: pId });
    setRating(5);
    setReviewText("");
    setReviewOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedItem || !selectedItem.productId) return;

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: selectedItem.productId,
          rating,
          reviewText
        })
      });

      if (response.ok) {
        setReviewOpen(false);
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
      } else {
        const errData = await response.json();
        toast({
          title: "Review Failed",
          description: errData.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting your review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const userId = user.id || (user as any)._id;
          const queryParams = new URLSearchParams();
          if (userId) queryParams.append('userId', userId);
          if (user.email) queryParams.append('email', user.email);

          const response = await fetch(`/api/orders?${queryParams.toString()}`);
          const data = await response.json();
          if (data.success) {
            setOrders(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

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

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-white flex ${inter.className}`}>

      {/* --- Sidebar (Left Navigation) --- */}
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
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">User Profile</h1>
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
            {/* Active Link: Orders */}
            <div className="flex items-center gap-4 px-8 py-3 text-black relative bg-gray-100">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-black rounded-r-md" />
              <Package className="w-5 h-5" />
              <span className="font-medium text-sm">Orders</span>
            </div>

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
          <span className="font-bold text-lg">My Orders</span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div className="max-w-6xl">
          {/* Orders List */}
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-gray-900">Order History</CardTitle>
              <CardDescription className="mt-2 text-gray-500">View and track your recent orders</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No orders yet</h3>
                  <p className="text-gray-500 mb-8 font-medium">Start shopping to see your order history here.</p>
                  <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95">
                    <Link href="/" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Start Shopping
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.orderId} className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-xl text-gray-900">{order.orderId}</h3>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                              {order.status}
                            </span>
                            {order.deliveryStatus && (
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.deliveryStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                Delivery: {order.deliveryStatus}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-2 font-medium">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-gray-900">Rp {order.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 font-medium">{order.items.length} items</p>
                        </div>
                      </div>
                      <Separator className="my-6 bg-gray-200" />
                      <div className="space-y-4">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="font-semibold text-gray-900">{item.name}</span>
                              <span className="text-gray-500 ml-2 font-medium">x{item.quantity}</span>
                              {(item.size || item.color) && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {item.size && `Size: ${item.size}`}
                                  {item.size && item.color && ' | '}
                                  {item.color && `Color: ${item.color}`}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="block text-gray-700 font-semibold">Rp {item.price.toLocaleString()}</span>
                              {(order.status !== 'cancelled') && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-xs h-auto p-0 text-black mt-2 font-semibold hover:text-gray-700 transition-colors"
                                  onClick={() => openReviewModal(item)}
                                >
                                  Rate Product
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 flex justify-end gap-3">
                        {order.status !== 'cancelled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReturnModal(order, order.items[0])}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-medium"
                          >
                            Return Order
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium">
                          <Link href={`/orders/${order._id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile FAB Menu */}
      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
        <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
          <Link href="/profile"><User className="h-5 w-5" /></Link>
        </Button>
        <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
          <Link href="/wishlist"><Heart className="h-5 w-5" /></Link>
        </Button>
      </div>

      {/* Review Modal - Needs to be outside main/sidebar structure but inside the wrapper */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Rate & Review</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="rating" className="text-sm font-semibold text-gray-700">Rating</Label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="review" className="text-sm font-semibold text-gray-700">Review</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e: any) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-100 transition-all duration-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleReviewSubmit}
              disabled={isSubmittingReview}
              className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95"
            >
              {isSubmittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Modal */}
      <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Return Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-sm font-bold text-gray-900">{returnItem?.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {returnItem?.size && `Size: ${returnItem.size}`}
                {returnItem?.size && returnItem?.color && ' | '}
                {returnItem?.color && `Color: ${returnItem.color}`}
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="return-reason" className="text-sm font-semibold text-gray-700">Reason for Return</Label>
              <Textarea
                id="return-reason"
                value={returnReason}
                onChange={(e: any) => setReturnReason(e.target.value)}
                placeholder="Please tell us why you want to return this item..."
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-100 transition-all duration-300 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleReturnSubmit}
              disabled={isSubmittingReturn || !returnReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg shadow-red-500/20 font-medium transition-all transform active:scale-95"
            >
              {isSubmittingReturn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Return Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}