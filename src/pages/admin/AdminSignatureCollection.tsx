import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Loader2,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getSignatureCollections,
  addToSignatureCollection,
  removeFromSignatureCollection,
  reorderSignatureCollections,
  toggleSignatureCollectionActive,
  type SignatureCollectionWithProduct,
} from '@/lib/api/signature-collection';
import { getCollectionProducts } from '@/lib/api/collection-products';
import { migrateSignatureCollection } from '@/lib/migrateSignatureCollection';
import { encodeImageUrl } from '@/lib/imageUtils';

const GOLD_COLOR = 'rgb(199, 158, 72)';

const AdminSignatureCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [collections, setCollections] = useState<SignatureCollectionWithProduct[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingProduct, setAddingProduct] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [collectionsData, productsData] = await Promise.all([
        getSignatureCollections(),
        getCollectionProducts({ isActive: true }),
      ]);

      setCollections(collectionsData);
      setAvailableProducts(productsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProductId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a product',
        variant: 'destructive',
      });
      return;
    }

    // Check if product is already in collection
    if (collections.some((c) => c.product_id === selectedProductId)) {
      toast({
        title: 'Error',
        description: 'This product is already in the signature collection',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAddingProduct(true);
      await addToSignatureCollection(selectedProductId);
      toast({
        title: 'Success',
        description: 'Product added to signature collection',
      });
      setSelectedProductId('');
      await loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add product',
        variant: 'destructive',
      });
    } finally {
      setAddingProduct(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromSignatureCollection(id);
      toast({
        title: 'Success',
        description: 'Product removed from signature collection',
      });
      await loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove product',
        variant: 'destructive',
      });
    }
    setDeleteDialog({ open: false, id: null });
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newCollections = [...collections];
    const temp = newCollections[index];
    newCollections[index] = newCollections[index - 1];
    newCollections[index - 1] = temp;

    // Update display orders
    const reorderData = newCollections.map((item, idx) => ({
      id: item.id,
      display_order: idx,
    }));

    try {
      await reorderSignatureCollections(reorderData);
      setCollections(newCollections);
      toast({
        title: 'Success',
        description: 'Order updated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reorder',
        variant: 'destructive',
      });
      await loadData();
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === collections.length - 1) return;

    const newCollections = [...collections];
    const temp = newCollections[index];
    newCollections[index] = newCollections[index + 1];
    newCollections[index + 1] = temp;

    // Update display orders
    const reorderData = newCollections.map((item, idx) => ({
      id: item.id,
      display_order: idx,
    }));

    try {
      await reorderSignatureCollections(reorderData);
      setCollections(newCollections);
      toast({
        title: 'Success',
        description: 'Order updated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reorder',
        variant: 'destructive',
      });
      await loadData();
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await toggleSignatureCollectionActive(id, !currentStatus);
      toast({
        title: 'Success',
        description: `Item ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
      await loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  // Handle migration
  const handleMigrate = async () => {
    const confirmed = window.confirm(
      "This will import the 6 signature collection products from your codebase into Supabase. Continue?"
    );
    if (!confirmed) return;

    try {
      setMigrating(true);
      const result = await migrateSignatureCollection();
      
      toast({
        title: "Migration Complete",
        description: `Successfully migrated ${result.success} products. ${result.failed > 0 ? `${result.failed} failed.` : ''}`,
      });

      // Reload collections
      await loadData();
    } catch (error) {
      toast({
        title: "Migration Error",
        description: error instanceof Error ? error.message : "Failed to migrate signature collection",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  // Filter out products that are already in collection
  const availableProductsFiltered = availableProducts.filter(
    (product) => !collections.some((c) => c.product_id === product.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-serif font-bold" style={{ color: '#1a1a1a' }}>
                  Signature Collection
                </h1>
                <p className="text-sm text-gray-500">Manage featured bouquets on home page</p>
              </div>
            </div>
            {collections.length === 0 && (
              <Button
                onClick={handleMigrate}
                disabled={migrating}
                variant="outline"
                className="gap-2"
              >
                {migrating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Import Signature Products
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Product Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Product to Signature Collection</CardTitle>
            <CardDescription>
              Select a product from your collection to feature on the home page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a product..." />
                </SelectTrigger>
                <SelectContent>
                  {availableProductsFiltered.length === 0 ? (
                    <SelectItem value="no-products" disabled>
                      No available products
                    </SelectItem>
                  ) : (
                    availableProductsFiltered.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.title} - ${product.price}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddProduct}
                disabled={!selectedProductId || addingProduct}
                className="gap-2"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                  color: 'white',
                }}
              >
                {addingProduct ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Product
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Collection List */}
        <Card>
          <CardHeader>
            <CardTitle>Signature Collection Items ({collections.length})</CardTitle>
            <CardDescription>
              Drag to reorder or use arrows. Only active items are displayed on the home page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products in signature collection yet.</p>
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-gray-400">
                    Import the 6 signature collection products from your codebase
                  </p>
                  <Button
                    onClick={handleMigrate}
                    disabled={migrating}
                    className="gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                      color: "white",
                    }}
                  >
                    {migrating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Migrating Signature Products...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Import Signature Collection
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    or add a product manually using the form above
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Order</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === collections.length - 1}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.product?.image_urls?.[0] ? (
                            <img
                              src={encodeImageUrl(item.product.image_urls[0])}
                              alt={item.product.title}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.product?.title || 'Product not found'}</div>
                          {item.product?.category && (
                            <div className="text-sm text-gray-500">{item.product.display_category || item.product.category}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${item.product?.price || 0}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.is_active ? 'default' : 'secondary'}
                            className={item.is_active ? 'bg-green-500' : ''}
                          >
                            {item.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(item.id, item.is_active)}
                              className="gap-1"
                            >
                              {item.is_active ? (
                                <>
                                  <EyeOff className="w-4 h-4" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  Show
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, id: item.id })}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Signature Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this product from the signature collection? It will no longer appear on the home page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.id && handleRemove(deleteDialog.id)}
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSignatureCollection;

