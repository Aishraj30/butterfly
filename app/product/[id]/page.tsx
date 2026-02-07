'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Star, Minus, Plus, ShoppingCart, Heart, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';

interface Product {
    id: string; // Changed from number to string to match MongoDB ObjectId
    name: string;
    price: number;
    category: string;
    subCategory?: string;
    color: string;
    colors?: string[];
    gender?: 'Male' | 'Female' | 'Unisex';
    size: string[];
    sizes?: string[];
    rating: number;
    reviews: number;
    reviewsCount?: number;
    image: string;
    imageGradient?: string;
    imageUrl?: string;
    images?: string[];
    inStock: boolean;
    stock?: number;
    onSale?: boolean;
    salePrice?: number;
    isNew?: boolean;
    description?: string;
    fabricComposition?: string;
    fit?: string;
    closure?: string;
    sleeveType?: string;
    washCare?: string;
    countryOfManufacture?: string;
    modelSize?: string;
    modelHeight?: string;
    shippingTime?: string;
    isActive?: boolean;
    brand?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);
    const [showWishlistPrompt, setShowWishlistPrompt] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            console.log('[Client] Fetching product with id:', id);
            const response = await fetch(`/api/products/${id}`);
            const data = await response.json();

            console.log('[Client] Response:', data);

            if (data.success && data.data) {
                setProduct(data.data);
                // Set default size
                const availableSizes = data.data.sizes || data.data.size || [];
                if (availableSizes && availableSizes.length > 0) {
                    setSelectedSize(availableSizes[0]);
                }
            } else {
                console.error('API Error:', data.message || data.error);
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async () => {
        if (!user) {
            setShowWishlistPrompt(true);
            return;
        }

        if (!product) return;

        try {
            if (isInWishlist(product.id)) {
                // Find the wishlist item and remove it
                const response = await fetch('/api/wishlist');
                if (response.ok) {
                    const data = await response.json();
                    const wishlistItem = data.data.find((item: any) => item.product._id === product.id);
                    if (wishlistItem) {
                        await removeFromWishlist(wishlistItem._id);
                    }
                }
            } else {
                // Add to wishlist
                await addToWishlist(product.id);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            // Show error message to user
            alert('Failed to update wishlist. Please try again.');
        }
    };

    const handleAddToCart = async () => {
        if (!product || !selectedSize) {
            setCartError('Please select a size');
            return;
        }

        if (!product.inStock) {
            setCartError('Product is out of stock');
            return;
        }

        try {
            setAddingToCart(true);
            setCartError(null);

            const result = await addToCart(
                String(product.id),
                quantity,
                selectedSize,
                product.color || '',
                product.name,
                product.salePrice || product.price,
                product.images?.[0] || product.imageUrl || product.image
            );

            if (result.success) {
                // Show success message
                alert(`${product.name} added to cart!`);
            } else {
                throw new Error(result.error || 'Failed to add to cart');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
            setCartError(errorMessage);
            console.error('[Product] Add to cart error:', error);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <main className="pt-10 pb-20 w-full bg-white min-h-screen">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse">
                            <p className="text-gray-500">Loading product details...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="pt-10 pb-20 w-full bg-white min-h-screen">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-gray-600 text-lg mb-4">Product not found</p>
                        <Link href="/catalog" className="text-primary hover:underline">
                            Back to Catalog
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const discountPercent = product.onSale && product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    const displayImage = product.images?.[0] || product.imageUrl || product.image;

    // Helper for display
    const displayColors = product.colors && product.colors.length > 0
        ? product.colors.join(', ')
        : product.color || 'N/A';

    const reviewCount = product.reviewsCount !== undefined ? product.reviewsCount : (product.reviews || 0);

    return (
        <main className="pt-10 pb-20 w-full bg-white min-h-screen">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
                >
                    <ChevronLeft size={20} />
                    Back
                </button>

                {/* Product Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {/* Left: Image */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-lg max-w-[480px] max-h-[600px]">
                            <div className="w-full h-full relative flex items-center justify-center bg-gray-50">
                                {displayImage ? (
                                    <img
                                        src={displayImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                                )}

                                {/* Badge */}
                                {(product.isNew || product.onSale) && (
                                    <div className="absolute top-4 left-4 z-10">
                                        {product.isNew && (
                                            <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 mb-2">
                                                NEW
                                            </div>
                                        )}
                                        {product.onSale && (
                                            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1">
                                                SALE
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-8">
                        <div className="flex items-start justify-between">
                            <div>
                                {product.brand && (
                                    <p className="text-gray-500 text-xs tracking-widest mb-2 uppercase">
                                        {product.brand}
                                    </p>
                                )}
                                {product.gender && (
                                    <p className="text-gray-500 text-xs tracking-widest mb-2 uppercase">
                                        {product.gender}
                                    </p>
                                )}
                                <h1 className="font-serif text-4xl text-black mb-1">{product.name}</h1>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={toggleWishlist}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                    title={!user ? "Login to add to wishlist" : "Add to wishlist"}
                                >
                                    <Heart
                                        size={20}
                                        className={product && isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"}
                                    />
                                </button>
                                {!user && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
                                )}
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-bold text-black">₹{product.salePrice || product.price}</p>
                                {product.onSale && product.salePrice && (
                                    <>
                                        <span className="text-gray-400 line-through text-lg">₹{product.price}</span>
                                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {discountPercent}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-1">
                                <span className="text-lg font-bold">{product.rating}</span>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < Math.round(product.rating) ? "fill-gray-400 text-gray-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm text-gray-600">
                                ({product.reviewsCount !== undefined ? product.reviewsCount : (product.reviews || 0)} reviews)
                            </span>
                        </div>

                        {/* Description & Model Info */}
                        <div className="space-y-4 text-gray-600">
                            {product.description && (
                                <p className="text-sm leading-relaxed">{product.description}</p>
                            )}

                            {(product.modelSize || product.modelHeight) && (
                                <ul className="text-sm list-disc pl-4 space-y-1">
                                    {product.modelSize && <li>Model wears a size: {product.modelSize}</li>}
                                    {product.modelHeight && <li>Model Height: {product.modelHeight}</li>}
                                </ul>
                            )}
                        </div>

                        

                        
                        {/* Size Selector */}
                        <div>
                            <h3 className="font-semibold text-black mb-3">Available Sizes</h3>
                            <div className="flex flex-wrap gap-2">
                                {['s', 'm', 'l', 'xl', 'xxl', 'custom'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[3rem] h-12 px-2 flex items-center justify-center border-2 text-sm font-medium transition-colors ${selectedSize === size
                                            ? 'bg-black text-white border-black'
                                            : 'border-gray-300 text-black hover:border-black'
                                            }`}
                                    >
                                        {size.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="space-y-4">
                            {cartError && (
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <p className="text-red-700 text-sm">{cartError}</p>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-black mb-3">Quantity</h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center border-2 border-gray-300 rounded w-32 justify-between px-4 py-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-1 hover:text-black transition-colors"
                                            disabled={addingToCart}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-semibold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-1 hover:text-black transition-colors"
                                            disabled={addingToCart}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock || addingToCart}
                                        className="flex-1 bg-black text-white font-bold uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed rounded"
                                    >
                                        {addingToCart ? 'Adding...' : 'ADD TO CART'}
                                        {!addingToCart && <ShoppingCart size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Login Prompt Modal */}
                        {showWishlistPrompt && (
                            <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 h-screen">
                                <div className="bg-white rounded-lg p-6 max-w-sm mx-4 space-y-4 shadow-xl border border-gray-200">
                                    <h3 className="text-lg font-bold text-black">Login Required</h3>
                                    <p className="text-gray-600">Please login to add items to your wishlist.</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowWishlistPrompt(false)}
                                            className="flex-1 px-4 py-2 border-2 border-gray-300 text-black rounded font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <Link
                                            href="/login"
                                            onClick={() => setShowWishlistPrompt(false)}
                                            className="flex-1 px-4 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors text-center"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shipping Info */}
                        {product.shippingTime && (
                            <div className="text-sm border-t border-b border-gray-100 py-3 mt-6">
                                <strong>Shipping Time: </strong> {product.shippingTime}
                            </div>
                        )}

                        {/* Product Specifications Layout */}
                        <div className="space-y-4 mt-6">
                            <h3 className="font-semibold text-black border-b border-black inline-block pb-1 mb-2">Product Specifications</h3>

                            <div className="text-sm space-y-2 text-gray-700">
                                <p><strong>Color:</strong> {displayColors}</p>
                                <p><strong>Fabric Composition:</strong> {product.fabricComposition || 'N/A'}</p>
                                <p><strong>Fit:</strong> {product.fit || 'N/A'}</p>
                                <p><strong>Closure:</strong> {product.closure || 'N/A'}</p>
                                <p><strong>Sleeve Type:</strong> {product.sleeveType || 'N/A'}</p>
                                <p><strong>Wash Care:</strong> {product.washCare || 'N/A'}</p>
                                <p><strong>Country of Manufacture:</strong> {product.countryOfManufacture || 'N/A'}</p>

                                                            </div>
                        </div>

                
                    </div>
                </div>
            </div>
        </main>
    );
}
