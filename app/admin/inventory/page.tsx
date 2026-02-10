"use client";

import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, AlertTriangle, PackageSearch } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { InventoryService } from "@/lib/inventoryService";

export default function InventoryPage() {
    const [filter, setFilter] = useState({ lowStock: false });
    const [search, setSearch] = useState("");
    const { inventory, isLoading, mutate } = useInventory(filter);

    // Status Badge Helper
    const getStatusBadge = (status: any) => {
        switch (status) {
            case "in_stock":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>;
            case "out_of_stock":
                return <Badge variant="destructive">Out of Stock</Badge>;
            case "discontinued":
                return <Badge variant="secondary">Discontinued</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Delete Handler
    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to delete this inventory item?")) return;
        try {
            await InventoryService.delete(id);
            mutate(); // Refresh list
        } catch (err: any) {
            alert(err.message);
        }
    }

    // Filtered Inventory (Client-side search if backend search not implemented for name)
    const filteredInventory = inventory?.filter((item: any) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
            item.sku.toLowerCase().includes(searchLower) ||
            item.productId?.name?.toLowerCase().includes(searchLower) ||
            item.color.toLowerCase().includes(searchLower) ||
            item.size.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground">Manage stock levels, variants, and warehouse locations.</p>
                </div>
                <Link href="/admin/inventory/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <PackageSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search SKU, Product, Color..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button
                    variant={filter.lowStock ? "destructive" : "outline"}
                    onClick={() => setFilter(prev => ({ ...prev, lowStock: !prev.lowStock }))}
                >
                    {filter.lowStock ? <AlertTriangle className="mr-2 h-4 w-4" /> : null}
                    Low Stock Only
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>Stock (Total / Reserved)</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Loading inventory...</TableCell>
                            </TableRow>
                        ) : filteredInventory?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">No inventory found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredInventory?.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.productId?.name || "Unknown Product"}</TableCell>
                                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <span className="inline-block w-4 h-4 rounded-full border" style={{ backgroundColor: item.color }} title={item.color}></span>
                                            <span className="text-sm">{item.size}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className={item.totalStock <= item.lowStockThreshold ? "text-red-600 font-bold" : ""}>
                                                {item.totalStock} Total
                                            </span>
                                            <span className="text-xs text-muted-foreground">{item.reservedStock} Reserved</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.warehouseLocation ? (
                                            <div className="text-xs">
                                                <div className="font-semibold">{item.warehouseLocation}</div>
                                                <div className="text-muted-foreground">{item.aisle ? `Aisle: ${item.aisle}` : ""} {item.shelf ? `Shelf: ${item.shelf}` : ""}</div>
                                            </div>
                                        ) : <span className="text-muted-foreground italic text-xs">Unassigned</span>}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.sku)}>
                                                    Copy SKU
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <Link href={`/admin/inventory/${item._id}`}>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item._id)}>
                                                    Delete Item
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
