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
import { Loader2, Package, Star } from "lucide-react";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function OrdersPage() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
        alert("Review submitted successfully!");
      } else {
        const errData = await response.json();
        alert("Failed to submit review: " + (errData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-600 mt-1">Track orders, view invoices, and manage returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <AccountSidebar />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Order History</CardTitle>
                <CardDescription className="mt-1">View and track your recent orders</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your order history here.</p>
                    <Button asChild>
                      <Link href="/" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Start Shopping
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.orderId} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{order.orderId}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                {order.status}
                              </span>
                              {order.deliveryStatus && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ml-2 ${order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.deliveryStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                  Delivery: {order.deliveryStatus}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">Rp {order.total.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{order.items.length} items</p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="space-y-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                {(item.size || item.color) && (
                                  <div className="text-xs text-gray-400">
                                    {item.size && `Size: ${item.size}`}
                                    {item.size && item.color && ' | '}
                                    {item.color && `Color: ${item.color}`}
                                  </div>

                                )}
                              </div>
                              <div className="text-right">
                                <span className="block text-gray-600">Rp {item.price.toLocaleString()}</span>
                                {((order.deliveryStatus === 'delivered') || (order.status === 'delivered')) && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="text-xs h-auto p-0 text-[#8B5E34] mt-1"
                                    onClick={() => openReviewModal(item)}
                                  >
                                    Rate Product
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
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
        </div>
      </div>
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rate & Review</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleReviewSubmit}
              disabled={isSubmittingReview}
            >
              {isSubmittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
