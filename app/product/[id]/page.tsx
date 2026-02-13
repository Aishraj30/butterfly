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
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);
    const [showWishlistPrompt, setShowWishlistPrompt] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (id) {
            fetchProductData();
            fetchRecommendedProducts();
        }
    }, [id]);

    const fetchRecommendedProducts = async () => {
        try {
            const response = await fetch(`/api/products/recommended?productId=${id}`);
            const data = await response.json();
            if (data.success) {
                setRecommendedProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch recommended products:', error);
        }
    };

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const [productRes, inventoryRes] = await Promise.all([
                fetch(`/api/products/${id}`),
                fetch(`/api/inventory?productId=${id}`)
            ]);

            const productData = await productRes.json();
            const invData = await inventoryRes.json();

            if (productData.success && productData.data) {
                setProduct(productData.data);
                setInventory(invData || []);

                // Set initial size (first one that is in stock)
                const sizes = productData.data.sizes || productData.data.size || [];
                const inStockSize = sizes.find((s: string) => {
                    const inv = invData.find((i: any) =>
                        (i.size === s || i.size === 'N/A') &&
                        (i.color === productData.data.color || i.color === 'N/A')
                    );
                    return inv ? (inv.totalStock - inv.reservedStock) > 0 : true;
                });
                setSelectedSize(inStockSize || sizes[0] || '');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isSizeAvailable = (size: string) => {
        if (!inventory.length) return true; // Default to true if no inventory records exist yet

        // Exact match for size and color
        let inv = inventory.find(i =>
            i.size === size && (i.color === product?.color || i.color === 'N/A')
        );

        // Fallback to No Variant match ONLY if no specific size records exist at all
        if (!inv) {
            const hasAnySpecificSizeRecord = inventory.some(i => i.size !== 'N/A');
            if (!hasAnySpecificSizeRecord) {
                inv = inventory.find(i => i.size === 'N/A' && i.color === 'N/A');
            }
        }

        if (!inv) return false; // If we have inventory data but no record for this size, it's out of stock
        return (inv.totalStock - inv.reservedStock) > 0;
    };

    const getStockInfo = (size: string) => {
        if (!inventory.length) return null;

        // Exact match for size and color
        let inv = inventory.find(i =>
            i.size === size && (i.color === product?.color || i.color === 'N/A')
        );

        // Fallback to No Variant match ONLY if no specific size records exist at all
        if (!inv) {
            const hasAnySpecificSizeRecord = inventory.some(i => i.size !== 'N/A');
            if (!hasAnySpecificSizeRecord) {
                inv = inventory.find(i => i.size === 'N/A' && i.color === 'N/A');
            }
        }

        if (!inv) return null;

        const availableStock = inv.totalStock - (inv.reservedStock || 0);
        const lowStockThreshold = inv.lowStockThreshold || 5;
        const isLowStock = availableStock > 0 && availableStock <= lowStockThreshold;

        return {
            available: availableStock,
            threshold: lowStockThreshold,
            isLow: isLowStock
        };
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
            <main className="w-full bg-white min-h-screen">
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
            <main className="w-full bg-white min-h-screen">
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

    const allImages = product.images || [product.imageUrl, product.image].filter(Boolean);
    const displayImage = allImages[selectedImageIndex] || product.images?.[0] || product.imageUrl || product.image;

    // Helper for display
    const displayColors = product.colors && product.colors.length > 0
        ? product.colors.join(', ')
        : product.color || 'N/A';

    const reviewCount = product.reviewsCount !== undefined ? product.reviewsCount : (product.reviews || 0);

    return (
        <main className="w-full bg-white min-h-screen">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Product Detail - Unified Scroll Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Images Column */}
                    <div className="lg:w-1/2">
                        <div className="space-y-0">
                            {allImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                                        )}
                                        
                                        {/* Badge on first image */}
                                        {index === 0 && (product.isNew || product.onSale) && (
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
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Specifications - Sticky on desktop */}
                    <div className="lg:w-1/2">
                        <div className="lg:sticky lg:top-8 space-y-8 pr-4">
                            {/* Product Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    {product.brand && (
                                        <p className="text-gray-500 text-xs tracking-widest mb-1 uppercase">
                                            {product.brand}
                                        </p>
                                    )}
                                    <h1 className="font-serif text-2xl text-black mb-1">{product.name}</h1>
                                    <p className="text-gray-600 text-sm">{product.gender}</p>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={toggleWishlist}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                        title={!user ? "Login to add to wishlist" : "Add to wishlist"}
                                    >
                                        <Heart
                                            size={18}
                                            className={product && isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"}
                                        />
                                    </button>
                                    {!user && (
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
                                    )}
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="mb-6">
                                <p className="text-2xl font-bold text-black">IDR {(product.salePrice || product.price).toLocaleString()}</p>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Low Stock Warning */}
                            {selectedSize && (() => {
                                const stockInfo = getStockInfo(selectedSize);
                                if (stockInfo && stockInfo.isLow) {
                                    return (
                                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                                            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-medium text-orange-800">
                                                Only {stockInfo.available} {stockInfo.available === 1 ? 'item' : 'items'} left in stock!
                                            </span>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

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

                            {/* Size Selection */}
                            <div>
                                <h3 className="font-semibold text-black mb-3 text-xs uppercase tracking-widest">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {(product.sizes || product.size || ['N/A']).map((size) => {
                                        const available = isSizeAvailable(size);
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => available && setSelectedSize(size)}
                                                disabled={!available}
                                                className={`relative min-w-[4rem] h-12 px-4 flex items-center justify-center border transition-all text-xs font-bold tracking-widest overflow-hidden group
                                                    ${selectedSize === size
                                                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                                        : available
                                                            ? 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
                                                            : 'border-gray-100 text-gray-200 cursor-not-allowed bg-gray-50'
                                                    }`}
                                            >
                                                {size.toUpperCase()}
                                                {!available && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="w-[140%] h-[1.5px] bg-black/40 -rotate-45 transform"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
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

                            {/* Shipping Info */}
                            {product.shippingTime && (
                                <div className="text-sm border-t border-b border-gray-100 py-3">
                                    <strong>Shipping Time: </strong> {product.shippingTime}
                                </div>
                            )}

                            {/* Product Specifications */}
                            <div className="space-y-4">
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
                        </div>
                    </div>
                </div>

                {/* Recommended Products Section */}
                {recommendedProducts.length > 0 && (
                    <div className="mt-16 mb-16 pt-12 border-t border-gray-200">
                        <h2 className="text-2xl font-serif text-black mb-8 text-center">RECOMMENDATIONS</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {recommendedProducts.map((recProduct) => (
                                <Link 
                                    key={recProduct.id} 
                                    href={`/product/${recProduct.id}`}
                                    className="group"
                                >
                                    <div className="space-y-3">
                                        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                                            {recProduct.images?.[0] || recProduct.imageUrl || recProduct.image ? (
                                                <img
                                                    src={recProduct.images?.[0] || recProduct.imageUrl || recProduct.image}
                                                    alt={recProduct.name}
                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                                                {recProduct.name}
                                            </h3>
                                            <p className="text-sm font-bold text-black">
                                                IDR {(recProduct.salePrice || recProduct.price).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
