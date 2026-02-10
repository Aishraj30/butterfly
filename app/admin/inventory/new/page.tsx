"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Assuming Label exists, if not I'll us standard label
import { InventoryService } from "@/lib/inventoryService";
import { Loader2 } from "lucide-react";

export default function NewInventoryPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        productId: "",
        color: "",
        size: "",
        sku: "",
        totalStock: 0,
        lowStockThreshold: 5,
        warehouseLocation: "",
        aisle: "",
        shelf: "",
        supplier: "",
        costPrice: 0,
    });

    useEffect(() => {
        // Fetch products for dropdown
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                // data might be { products: [...] } or [...]
                setProducts(Array.isArray(data) ? data : data.products || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleProductChange = (productId: any) => {
        const product = products.find((p: any) => p._id === productId);
        setSelectedProduct(product);
        setFormData(prev => ({
            ...prev,
            productId,
            color: "", // Reset variant selection
            size: ""
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await InventoryService.create(formData);
            router.push("/admin/inventory");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Add Inventory Item</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Selection</CardTitle>
                        <CardDescription>Choose the product and variant to track.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Product</Label>
                            <Select onValueChange={handleProductChange} value={formData.productId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product: any) => (
                                        <SelectItem key={product._id} value={product._id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedProduct && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <Select
                                        onValueChange={(val: any) => setFormData({ ...formData, color: val })}
                                        value={formData.color}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedProduct.colors?.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: c }}></div>
                                                        {c}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Size</Label>
                                    <Select
                                        onValueChange={(val) => setFormData({ ...formData, size: val })}
                                        value={formData.size}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedProduct.sizes?.map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>SKU (Stock Keeping Unit)</Label>
                            <Input
                                required
                                placeholder="e.g. TSHIRT-RED-M-001"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Stock Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Initial Stock</Label>
                            <Input
                                type="number"
                                min="0"
                                required
                                value={formData.totalStock}
                                onChange={(e) => setFormData({ ...formData, totalStock: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Low Stock Threshold</Label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.lowStockThreshold}
                                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Cost Price</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.costPrice}
                                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Supplier</Label>
                            <Input
                                placeholder="Supplier Name"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Warehouse Location</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Location / Zone</Label>
                            <Input
                                placeholder="Zone A"
                                value={formData.warehouseLocation}
                                onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Aisle</Label>
                            <Input
                                placeholder="Aisle 1"
                                value={formData.aisle}
                                onChange={(e) => setFormData({ ...formData, aisle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Shelf</Label>
                            <Input
                                placeholder="Shelf 3"
                                value={formData.shelf}
                                onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Item
                    </Button>
                </div>
            </form>
        </div>
    );
}
