'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogBanner } from '@/components/catalog/CatalogBanner';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    subcategory?: string;
    color: string;
    gender?: string;
    size: string[];
    rating: number;
    reviews: number;
    image?: string;
    imageUrl?: string;
    inStock: boolean;
    onSale?: boolean;
    salePrice?: number;
    images?: string[];
}

interface Collection {
    id: number;  // actually string in mongo, but let's keep it flexible or string
    _id: string;
    name: string;
    description?: string;
    categories?: string[];
    productCount?: number;
    products?: Product[];
}

export default function CatalogPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const collectionParam = searchParams.get('collection');

    // Find the collection that matches the URL parameter
    const currentCollection = collections.find(c =>
        c.name.toLowerCase() === collectionParam?.toLowerCase()
    );

    useEffect(() => {
        fetchCollections();
    }, []);

    useEffect(() => {
        if (collectionParam) {
            // Fetch products for specific collection
            fetchCollectionProducts(collectionParam);
        } else {
            setProducts([]);
        }
    }, [collectionParam]);

    const fetchCollections = async () => {
        try {
            setIsLoading(true);
            const collectionsRes = await fetch('/api/collections');
            const collectionsData = await collectionsRes.json();

            if (collectionsData.success) {
                setCollections(collectionsData.collections || []);
            }
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCollectionProducts = async (collectionName: string) => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            
            if (data.success && data.products && Array.isArray(data.products)) {
                // Filter products that belong to this collection
                const collectionProducts = data.products.filter((p: Product) => {
                    const decodedCollectionName = decodeURIComponent(collectionName.toLowerCase());
                    const productCategory = p.category?.toLowerCase();
                    const productSubCategory = p.subcategory?.toLowerCase();
                    
                    return productCategory === decodedCollectionName || productSubCategory === decodedCollectionName;
                })
                setProducts(collectionProducts);
            } else {
                console.error('Invalid data structure:', data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch collection products:', error);
            setProducts([]);
        }
    };

    const getPlaceholderImage = (productName: string): string => {
        const gradients = [
            'bg-gradient-to-br from-purple-100 to-pink-100',
            'bg-gradient-to-br from-pink-100 to-rose-100',
            'bg-gradient-to-br from-amber-50 to-orange-100',
            'bg-gradient-to-br from-slate-100 to-gray-100',
            'bg-gradient-to-br from-yellow-100 to-amber-100',
            'bg-gradient-to-br from-orange-50 to-yellow-100',
        ];
        return gradients[productName.length % gradients.length];
    };

    return (
        <main className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
            {/* Banner Section */}
            <CatalogBanner />

            <div className="max-w-[1400px] mx-auto px-5 py-8">
                {/* Categories/Products Section */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                ) : collectionParam ? (
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link href="/catalog" className="hover:text-black">Catalog</Link>
                            <span>/</span>
                            <span className="text-black font-medium capitalize">{collectionParam}</span>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-black capitalize">
                                {collectionParam}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Showing products in {collectionParam} collection
                            </p>
                        </div>

                        {products.length === 0 ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="text-center">
                                    <p className="text-gray-600 text-lg mb-4">No products found in this collection</p>
                                    <Link 
                                        href="/catalog" 
                                        className="inline-flex items-center justify-center px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide uppercase"
                                    >
                                        Back to Catalog
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {products.map((product) => (
                                    <Link
                                        href={`/product/${product.id}`}
                                        key={product.id}
                                        className="group block"
                                    >
                                        <div className="relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 mb-4">
                                            {/* Product Image */}
                                            <div className="relative aspect-[4/5] overflow-hidden rounded-t-lg">
                                                {(product.images && product.images.length > 0) || product.image || product.imageUrl ? (
                                                    <img
                                                        src={product.images?.[0] || product.image || product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">No Image</span>
                                                    </div>
                                                )}
                                                
                                                {/* Badges */}
                                                <div className="absolute top-4 left-4 z-10 flex gap-2">
                                                    {product.isNew && (
                                                        <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                            NEW
                                                        </div>
                                                    )}
                                                    {product.onSale && (
                                                        <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                            SALE
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Product Info */}
                                            <div className="p-4 space-y-2">
                                                <h3 className="font-medium text-black text-sm uppercase tracking-wide mb-2">
                                                    {product.name}
                                                </h3>
                                                
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-black font-semibold text-lg">
                                                        ₹{product.salePrice || product.price}
                                                    </p>
                                                    {product.salePrice && (
                                                        <>
                                                            <span className="text-gray-400 line-through text-sm">
                                                                ₹{product.price}
                                                            </span>
                                                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                                                                {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : collections.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">No categories found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection) => (
                            <Link
                                href={`/catalog?collection=${encodeURIComponent(collection.name)}`}
                                key={collection.id}
                                className="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-[#8D7B68] transition-colors cursor-pointer"
                            >
                                {/* Category Image Placeholder */}
                                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                    <div className={`w-full h-full ${getPlaceholderImage(collection.name)} flex items-center justify-center`}>
                                        <div className="text-center">
                                            <div className="text-4xl font-serif text-gray-400 mb-2">
                                                {collection.name.charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Info */}
                                <div className="p-6 bg-white">
                                    <h3 className="text-xl font-serif font-bold text-black mb-2 group-hover:text-[#8D7B68] transition-colors">
                                        {collection.name}
                                    </h3>
                                    {collection.description && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {collection.description}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {collection.productCount || 0} Products
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
