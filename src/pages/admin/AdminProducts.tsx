import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  DollarSign,
  Percent,
  Heart,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Tag,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { generatedCategories } from "@/data/generatedBouquets";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  getCollectionProducts,
  getCollectionProduct,
  createCollectionProduct,
  updateCollectionProduct,
  deleteCollectionProduct,
  getAllTags,
} from "@/lib/api/collection-products";
import { migrateProductsToSupabase } from "@/lib/migrateProducts";
import { encodeImageUrl } from "@/lib/imageUtils";

const GOLD_COLOR = "rgb(199, 158, 72)";

const AdminProducts = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id && id !== "new";
  const isCreating = id === "new";

  // State management
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showProductForm, setShowProductForm] = useState(isEditing || isCreating);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product: any | null }>({
    open: false,
    product: null,
  });

  // Form state
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    price: 0,
    category: "",
    display_category: "",
    featured: false,
    tags: [],
    image_urls: [],
    is_active: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    loadData();
  }, [navigate]);

  useEffect(() => {
    if (isEditing && id) {
      loadProduct(id);
    } else if (isCreating) {
      setFormData({
        title: "",
        description: "",
        price: 0,
        category: "",
        display_category: "",
        featured: false,
        tags: [],
        image_urls: [],
        is_active: true,
      });
      setShowProductForm(true);
    }
  }, [id, isEditing, isCreating]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, tagsData] = await Promise.all([
        getCollectionProducts(),
        getAllTags(),
      ]);
      setProducts(productsData);
      setAllTags(tagsData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      const product = await getCollectionProduct(productId);
      if (product) {
        setSelectedProduct(product);
        setFormData({
          title: product.title,
          description: product.description || "",
          price: product.price,
          category: product.category || "",
          display_category: product.display_category || "",
          featured: product.featured,
          tags: product.tags || [],
          image_urls: product.image_urls || [],
          is_active: product.is_active,
        });
        setShowProductForm(true);
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate("/admin/products");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load product",
        variant: "destructive",
      });
      navigate("/admin/products");
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle product save
  const handleSave = async () => {
    if (!formData.title || !formData.price || (formData.image_urls.length === 0 && imageFiles.length === 0)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (title, price, at least one image).",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      if (isEditing && selectedProduct) {
        // Update existing product
        await updateCollectionProduct(
          selectedProduct.id,
          formData,
          imageFiles,
          imagesToDelete
        );
        toast({
          title: "Product Updated",
          description: `${formData.title} has been updated successfully.`,
        });
      } else {
        // Create new product
        await createCollectionProduct(formData, imageFiles);
        toast({
          title: "Product Created",
          description: `${formData.title} has been created successfully.`,
        });
      }

      setShowProductForm(false);
      setSelectedProduct(null);
      setImageFiles([]);
      setImagesToDelete([]);
      navigate("/admin/products");
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle product delete
  const handleDelete = async (product: any) => {
    try {
      await deleteCollectionProduct(product.id);
      toast({
        title: "Product Deleted",
        description: `${product.title} has been deleted.`,
      });
      setDeleteDialog({ open: false, product: null });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // Handle image changes
  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, image_urls: images });
  };

  const handleFilesChange = (files: File[]) => {
    setImageFiles(files);
  };

  // Handle tag management
  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      if (!allTags.includes(newTag)) {
        setAllTags([...allTags, newTag]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t: string) => t !== tag),
    });
  };

  // Handle migration
  const handleMigrate = async () => {
    const confirmed = window.confirm(
      "This will import all existing products from your codebase into Supabase. Continue?"
    );
    if (!confirmed) return;

    try {
      setMigrating(true);
      const { generatedBouquets } = await import("@/data/generatedBouquets");
      const result = await migrateProductsToSupabase(generatedBouquets);
      
      toast({
        title: "Migration Complete",
        description: `Successfully migrated ${result.success} products. ${result.failed > 0 ? `${result.failed} failed.` : ''}`,
      });

      // Reload products
      await loadData();
    } catch (error) {
      toast({
        title: "Migration Error",
        description: error instanceof Error ? error.message : "Failed to migrate products",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

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
                onClick={() => navigate("/admin/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-serif font-bold" style={{ color: "#1a1a1a" }}>
                  Collection Products
                </h1>
                <p className="text-sm text-gray-500">Manage all products, prices, and inventory</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {products.length === 0 && (
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
                      Import Existing Products
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={() => {
                  navigate("/admin/products/new");
                  setShowProductForm(true);
                }}
                className="gap-2"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                  color: "white",
                }}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showProductForm ? (
          <>
            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {generatedCategories
                        .filter((c) => c.id !== "all")
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Products ({filteredProducts.length})</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    {searchQuery || categoryFilter !== "all" || statusFilter !== "all" ? (
                      <>
                        <p className="text-gray-500">No products found.</p>
                        <p className="text-sm mt-2 text-gray-400">Try adjusting your filters.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-4">No products in database yet.</p>
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-sm text-gray-400">
                            Import your existing products from the codebase
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
                                Migrating Products...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                Import Existing Products
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-gray-400 mt-2">
                            or click "Add Product" to create a new one
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              {product.image_urls?.[0] ? (
                                <img
                                  src={encodeImageUrl(product.image_urls[0])}
                                  alt={product.title}
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
                              <div className="font-medium">{product.title}</div>
                              {product.featured && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  Featured
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{product.display_category || product.category}</TableCell>
                            <TableCell>
                              <span className="font-medium">${product.price}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {product.tags?.slice(0, 2).map((tag: string) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {product.tags?.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{product.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={product.is_active ? "default" : "secondary"}
                                className={product.is_active ? "bg-green-500" : ""}
                              >
                                {product.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigate(`/admin/products/${product.id}`);
                                  }}
                                  className="gap-1"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteDialog({ open: true, product })}
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
          </>
        ) : (
          /* Product Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{isEditing ? "Edit Product" : "Create New Product"}</CardTitle>
                    <CardDescription>Manage product details, pricing, and inventory</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowProductForm(false);
                      navigate("/admin/products");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Product Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Celebration Sparkle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => {
                          const category = generatedCategories.find((c) => c.id === value);
                          setFormData({
                            ...formData,
                            category: value,
                            display_category: category?.name || "",
                          });
                        }}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {generatedCategories
                            .filter((c) => c.id !== "all")
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product description..."
                      rows={4}
                    />
                  </div>

                  {/* Image Upload */}
                  <ImageUpload
                    images={formData.image_urls}
                    onImagesChange={handleImagesChange}
                    onFilesChange={handleFilesChange}
                    maxImages={10}
                    multiple={true}
                    label="Product Images (Drag to reorder, first is primary)"
                  />

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Price ($) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                          }
                          className="pl-10"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <Label>Tags (for filtering and search)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!newTag}
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Tag
                      </Button>
                    </div>
                    {allTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500">Suggested:</span>
                        {allTags.filter(t => !formData.tags.includes(t)).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-white"
                            onClick={() => setFormData({ ...formData, tags: [...formData.tags, tag] })}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag: string) => (
                        <Badge key={tag} className="gap-2">
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Switches */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="featured" className="font-medium cursor-pointer">
                          Featured Product
                        </Label>
                        <p className="text-sm text-gray-500">Display prominently in collection</p>
                      </div>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="is_active" className="font-medium cursor-pointer">
                          Active
                        </Label>
                        <p className="text-sm text-gray-500">Show on website</p>
                      </div>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowProductForm(false);
                        navigate("/admin/products");
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                        color: "white",
                      }}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {isEditing ? "Update Product" : "Create Product"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, product: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deleteDialog.product?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setDeleteDialog({ open, product: null })}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteDialog.product && handleDelete(deleteDialog.product)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminProducts;
