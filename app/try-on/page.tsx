
'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Camera, Shirt, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';

export default function TryOnPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [generationId, setGenerationId] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    // Product Selection State
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch products on mount
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.products || []);
                }
            })
            .catch(err => console.error('Failed to fetch products', err))
            .finally(() => setIsLoadingProducts(false));
    }, []);

    // Poll for status if we have a generationId
    useEffect(() => {
        if (!generationId) return;

        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/try-on/status/${generationId}`);
                const data = await res.json();

                if (data.status === 'completed' && data.output && data.output.length > 0) {
                    setResultImage(data.output[0]);
                    setIsGenerating(false);
                    setGenerationId(null);
                    setStatusMessage('Complete!');
                    clearInterval(pollInterval);
                } else if (data.status === 'failed') {
                    setIsGenerating(false);
                    setGenerationId(null);
                    setStatusMessage('Generation failed. Please try again.');
                    clearInterval(pollInterval);
                } else {
                    setStatusMessage(`Processing... (${data.status})`);
                }
            } catch (err) {
                console.error('Polling error', err);
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [generationId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/try-on/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.url) {
                setUserImage(data.url);
            } else {
                alert('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleGenerate = async () => {
        if (!userImage || !selectedProduct) return;

        setIsGenerating(true);
        setResultImage(null);
        setStatusMessage('Starting generation...');
        setStep(3);

        // Determine category based on product or simple logic
        // FASHN requires: 'tops', 'bottoms', 'one-pieces'
        let category = 'one-pieces'; // Default fallback
        const lowerCat = (selectedProduct.category || '').toLowerCase();
        const lowerSub = (selectedProduct.subCategory || '').toLowerCase();

        if (lowerCat.includes('top') || lowerSub.includes('shirt') || lowerSub.includes('blouse') || lowerSub.includes('jacket')) {
            category = 'tops';
        } else if (lowerCat.includes('bottom') || lowerSub.includes('pant') || lowerSub.includes('skirt') || lowerSub.includes('jean')) {
            category = 'bottoms';
        }

        try {
            // Use the first image of the product
            const garmentImage = selectedProduct.images?.[0] || selectedProduct.image;

            if (!garmentImage) {
                alert('Selected product has no image');
                setIsGenerating(false);
                setStep(2);
                return;
            }

            const res = await fetch('/api/try-on/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model_image: userImage,
                    garment_image: garmentImage,
                    category,
                }),
            });

            const data = await res.json();

            if (data.error) {
                alert('Generation error: ' + data.error);
                setIsGenerating(false);
                setStep(2); // Go back
            } else if (data.status === 'completed' && data.output && data.output.length > 0) {
                // Immediate completion (Segmind)
                setResultImage(data.output[0]);
                setIsGenerating(false);
                setStatusMessage('Complete!');
            } else {
                setGenerationId(data.id);
                setStatusMessage('Queued...');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to start generation');
            setIsGenerating(false);
            setStep(2);
        }
    };

    const filteredProducts = products.filter(p => {
        if (categoryFilter === 'all') return true;
        // Simple filter logic
        const lowerCat = (p.category || '').toLowerCase();
        const lowerSub = (p.subCategory || '').toLowerCase();
        const combined = lowerCat + ' ' + lowerSub;
        if (categoryFilter === 'tops') return combined.includes('top') || combined.includes('shirt') || combined.includes('blouse') || combined.includes('jacket');
        if (categoryFilter === 'bottoms') return combined.includes('bottom') || combined.includes('pant') || combined.includes('skirt') || combined.includes('jean');
        if (categoryFilter === 'dresses') return combined.includes('dress') || combined.includes('one-piece') || combined.includes('gown');
        return true;
    });

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <span className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-2 block">
                            Virtual Studio
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">
                            Try It On
                        </h1>
                        <p className="text-gray-500 max-w-lg mx-auto font-light">
                            Experience our collection on you. Upload a photo and see how our pieces fit your style instantly.
                        </p>
                    </motion.div>
                </header>

                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-black' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step >= 1 ? 'border-black bg-black text-white' : 'border-gray-300'}`}>1</div>
                            <span className="text-xs font-bold tracking-widest uppercase hidden md:inline">Upload</span>
                        </div>
                        <div className="w-12 h-[1px] bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step >= 2 ? 'border-black bg-black text-white' : 'border-gray-300'}`}>2</div>
                            <span className="text-xs font-bold tracking-widest uppercase hidden md:inline">Select Outfit</span>
                        </div>
                        <div className="w-12 h-[1px] bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-black' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step >= 3 ? 'border-black bg-black text-white' : 'border-gray-300'}`}>3</div>
                            <span className="text-xs font-bold tracking-widest uppercase hidden md:inline">Result</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* LEFT COLUMN: User Image & Result */}
                    <div className="lg:sticky lg:top-32 space-y-8">
                        <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 group">
                            {step === 3 && resultImage ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={resultImage}
                                        alt="Virtual Try-On Result"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <a
                                            href={resultImage}
                                            download="my-try-on.jpg"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-black hover:text-white transition-colors"
                                        >
                                            <Upload size={20} className="rotate-180" />
                                        </a>
                                    </div>
                                </div>
                            ) : step === 3 && isGenerating ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                    <RefreshCw className="w-12 h-12 text-black animate-spin mb-4" />
                                    <p className="text-sm font-bold tracking-widest uppercase animate-pulse">{statusMessage}</p>
                                    <p className="text-xs text-gray-500 mt-2">This may take about 15-30 seconds</p>
                                </div>
                            ) : userImage ? (
                                <>
                                    <img
                                        src={userImage}
                                        alt="Your Upload"
                                        className="w-full h-full object-cover"
                                    />
                                    {step < 3 && (
                                        <button
                                            onClick={() => setUserImage(null)}
                                            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-black hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Camera className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold tracking-widest uppercase">Upload Your Photo</p>
                                    <p className="text-xs text-gray-500 mt-2">Full body shot works best</p>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="image/*"
                            />

                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                                    <RefreshCw className="w-8 h-8 text-black animate-spin" />
                                </div>
                            )}
                        </div>

                        {step === 3 && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setStep(2);
                                        setResultImage(null);
                                    }}
                                    className="flex-1 py-4 border border-black text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                                >
                                    Try Another Outfit
                                </button>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setUserImage(null);
                                        setSelectedProduct(null);
                                        setResultImage(null);
                                    }}
                                    className="flex-1 py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
                                >
                                    Start Over
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Product Selection */}
                    <div className="space-y-8">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gray-50 p-8 rounded-2xl border border-gray-100"
                            >
                                <h2 className="text-xl font-serif mb-4">Instructions</h2>
                                <ul className="space-y-4 text-sm text-gray-600 mb-8">
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold border border-gray-200">1</span>
                                        Ensure your full body is visible in the photo.
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold border border-gray-200">2</span>
                                        Avoid wearing loose or baggy clothing for best results.
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold border border-gray-200">3</span>
                                        Good lighting and a simple background help.
                                    </li>
                                </ul>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                                </button>

                                {userImage && (
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full mt-4 py-4 border border-black text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Next Step <ChevronRight size={16} />
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {step >= 2 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={step === 3 ? 'opacity-50 pointer-events-none' : ''}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-serif">Select Outfit</h2>
                                    <div className="flex gap-2">
                                        {['all', 'tops', 'bottoms', 'dresses'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategoryFilter(cat)}
                                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full transition-colors ${categoryFilter === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {isLoadingProducts ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg"></div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={(product as any)._id || product.id}
                                                onClick={() => setSelectedProduct(product)}
                                                className={`group cursor-pointer relative rounded-lg overflow-hidden border-2 transition-all ${selectedProduct === product ? 'border-black ring-1 ring-black' : 'border-transparent hover:border-gray-200'}`}
                                            >
                                                <div className="aspect-[3/4] bg-gray-100 relative">
                                                    <img
                                                        src={product.images?.[0] || product.image || ""}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {selectedProduct === product && (
                                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                                                                <Sparkles size={14} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3 bg-white">
                                                    <p className="text-xs font-bold truncate">{product.name}</p>
                                                    <p className="text-[10px] text-gray-500">₹{product.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg p-4 -mx-4 md:-mx-8 border-t border-gray-100 mt-8 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {selectedProduct ? (
                                                <>
                                                    <img
                                                        src={selectedProduct.images?.[0] || selectedProduct.image || ""}
                                                        className="w-10 h-10 rounded object-cover border border-gray-200"
                                                        alt=""
                                                    />
                                                    <div className="hidden sm:block">
                                                        <p className="text-xs font-bold">{selectedProduct.name}</p>
                                                        <p className="text-[10px] text-gray-500">Ready to try on</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-xs text-gray-500 italic">Select an item to continue</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={!selectedProduct || !userImage}
                                            className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <Sparkles size={16} />
                                            Generate Look
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
