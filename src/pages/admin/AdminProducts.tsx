import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Percent,
  Package,
  Heart,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Eye,
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
import { generatedBouquets, generatedCategories } from "@/data/generatedBouquets";
import type { Bouquet } from "@/types/bouquet";

const GOLD_COLOR = "rgb(199, 158, 72)";

// Extended product interface
interface ExtendedProduct extends Bouquet {
  outOfStock?: boolean;
  soldOut?: boolean;
  seasonal?: boolean;
  discount?: number;
  favoritesCount?: number;
  cartAdditionsCount?: number;
  description?: string;
  images?: string[];
}

const AdminProducts = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id && id !== "new";
  const isCreating = id === "new";

  // State management
  const [products, setProducts] = useState<ExtendedProduct[]>(() => {
    // Load products from localStorage or use generated data
    const saved = localStorage.getItem("adminProducts");
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with extended data
    return generatedBouquets.map((p) => ({
      ...p,
      outOfStock: false,
      soldOut: false,
      seasonal: false,
      discount: 0,
      favoritesCount: Math.floor(Math.random() * 50),
      cartAdditionsCount: Math.floor(Math.random() * 30),
      images: [p.image],
    }));
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showProductForm, setShowProductForm] = useState(isEditing || isCreating);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product: ExtendedProduct | null }>({
    open: false,
    product: null,
  });

  // Form state
  const [formData, setFormData] = useState<ExtendedProduct>({
    id: "",
    name: "",
    price: 0,
    image: "",
    description: "",
    category: "",
    displayCategory: "",
    featured: false,
    outOfStock: false,
    soldOut: false,
    seasonal: false,
    discount: 0,
    favoritesCount: 0,
    cartAdditionsCount: 0,
    images: [],
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    // Load products
    const saved = localStorage.getItem("adminProducts");
    if (saved) {
      setProducts(JSON.parse(saved));
    }

    // Load product for editing
    if (isEditing && id) {
      const product = products.find((p) => p.id === id);
      if (product) {
        setSelectedProduct(product);
        setFormData(product);
        setShowProductForm(true);
      } else {
        navigate("/admin/products");
      }
    } else if (isCreating) {
      setFormData({
        id: `product-${Date.now()}`,
        name: "",
        price: 0,
        image: "",
        description: "",
        category: "",
        displayCategory: "",
        featured: false,
        outOfStock: false,
        soldOut: false,
        seasonal: false,
        discount: 0,
        favoritesCount: 0,
        cartAdditionsCount: 0,
        images: [],
      });
      setShowProductForm(true);
    }
  }, [id, isEditing, isCreating, navigate]);

  // Save products to localStorage
  const saveProducts = (updatedProducts: ExtendedProduct[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "in-stock" && !product.outOfStock && !product.soldOut && !product.seasonal) ||
      (statusFilter === "out-of-stock" && product.outOfStock) ||
      (statusFilter === "sold-out" && product.soldOut) ||
      (statusFilter === "seasonal" && product.seasonal);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle product save
  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (name, price, image).",
        variant: "destructive",
      });
      return;
    }

    let updatedProducts: ExtendedProduct[];

    if (isEditing || selectedProduct) {
      // Update existing product
      updatedProducts = products.map((p) => (p.id === formData.id ? formData : p));
      toast({
        title: "Product Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      // Create new product
      updatedProducts = [...products, formData];
      toast({
        title: "Product Created",
        description: `${formData.name} has been created successfully.`,
      });
    }

    saveProducts(updatedProducts);
    setShowProductForm(false);
    setSelectedProduct(null);
    navigate("/admin/products");
  };

  // Handle product delete
  const handleDelete = (product: ExtendedProduct) => {
    const updatedProducts = products.filter((p) => p.id !== product.id);
    saveProducts(updatedProducts);
    setDeleteDialog({ open: false, product: null });
    toast({
      title: "Product Deleted",
      description: `${product.name} has been deleted.`,
    });
  };

  // Handle image upload (mock - replace with actual upload)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setFormData({ ...formData, image: imageUrl, images: [imageUrl, ...(formData.images || [])] });
      };
      reader.readAsDataURL(file);
    }
  };

  // Get product stats
  const getProductStats = (product: ExtendedProduct) => {
    return {
      favorites: product.favoritesCount || 0,
      cartAdditions: product.cartAdditionsCount || 0,
      stockStatus: product.soldOut
        ? "sold-out"
        : product.outOfStock
        ? "out-of-stock"
        : product.seasonal
        ? "seasonal"
        : "in-stock",
    };
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
                  Product Management
                </h1>
                <p className="text-sm text-gray-500">Manage all products, prices, and inventory</p>
              </div>
            </div>
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
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      <SelectItem value="sold-out">Sold Out</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Favorites</TableHead>
                        <TableHead>Cart Adds</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const stats = getProductStats(product);
                        const finalPrice = product.discount
                          ? product.price * (1 - product.discount / 100)
                          : product.price;

                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{product.name}</div>
                              {product.featured && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  Featured
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{product.displayCategory || product.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {product.discount ? (
                                  <>
                                    <span className="text-gray-400 line-through">${product.price}</span>
                                    <span className="font-bold text-green-600">${finalPrice.toFixed(2)}</span>
                                  </>
                                ) : (
                                  <span className="font-medium">${product.price}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {product.discount ? (
                                <Badge className="bg-red-500">{product.discount}% OFF</Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {stats.stockStatus === "sold-out" ? (
                                <Badge variant="destructive">Sold Out</Badge>
                              ) : stats.stockStatus === "out-of-stock" ? (
                                <Badge variant="outline" className="border-red-500 text-red-600">
                                  Out of Stock
                                </Badge>
                              ) : stats.stockStatus === "seasonal" ? (
                                <Badge className="bg-blue-500">Seasonal</Badge>
                              ) : (
                                <Badge className="bg-green-500">In Stock</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-pink-600">
                                <Heart className="w-4 h-4" />
                                <span>{stats.favorites}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-orange-600">
                                <ShoppingCart className="w-4 h-4" />
                                <span>{stats.cartAdditions}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigate(`/admin/products/${product.id}`);
                                    setSelectedProduct(product);
                                    setFormData(product);
                                    setShowProductForm(true);
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
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
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
                      <Label htmlFor="name">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            displayCategory: category?.name || "",
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
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product description..."
                      rows={4}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <Label>
                      Product Image <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      {formData.image && (
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label htmlFor="image-upload">
                          <Button variant="outline" type="button" className="gap-2 cursor-pointer" asChild>
                            <span>
                              <Upload className="w-4 h-4" />
                              Upload Image
                            </span>
                          </Button>
                        </Label>
                        <p className="text-sm text-gray-500 mt-2">
                          Or enter image URL:
                        </p>
                        <Input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

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
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount || 0}
                          onChange={(e) =>
                            setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })
                          }
                          className="pl-10"
                          placeholder="0"
                        />
                      </div>
                      {formData.discount && formData.discount > 0 && (
                        <p className="text-sm text-green-600">
                          Final Price: ${(formData.price * (1 - formData.discount / 100)).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="space-y-4">
                    <Label>Stock Status</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <Label htmlFor="in-stock" className="font-medium cursor-pointer">
                              In Stock
                            </Label>
                            <p className="text-xs text-gray-500">Product is available</p>
                          </div>
                        </div>
                        <Switch
                          id="in-stock"
                          checked={!formData.outOfStock && !formData.soldOut && !formData.seasonal}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                outOfStock: false,
                                soldOut: false,
                                seasonal: false,
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <Label htmlFor="out-of-stock" className="font-medium cursor-pointer">
                              Out of Stock
                            </Label>
                            <p className="text-xs text-gray-500">Temporarily unavailable</p>
                          </div>
                        </div>
                        <Switch
                          id="out-of-stock"
                          checked={formData.outOfStock || false}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              outOfStock: checked,
                              soldOut: checked ? false : formData.soldOut,
                              seasonal: checked ? false : formData.seasonal,
                            });
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-gray-600" />
                          <div>
                            <Label htmlFor="sold-out" className="font-medium cursor-pointer">
                              Sold Out
                            </Label>
                            <p className="text-xs text-gray-500">No longer available</p>
                          </div>
                        </div>
                        <Switch
                          id="sold-out"
                          checked={formData.soldOut || false}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              soldOut: checked,
                              outOfStock: checked ? false : formData.outOfStock,
                              seasonal: checked ? false : formData.seasonal,
                            });
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <Label htmlFor="seasonal" className="font-medium cursor-pointer">
                              Seasonal
                            </Label>
                            <p className="text-xs text-gray-500">Seasonal flower</p>
                          </div>
                        </div>
                        <Switch
                          id="seasonal"
                          checked={formData.seasonal || false}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              seasonal: checked,
                              outOfStock: checked ? false : formData.outOfStock,
                              soldOut: checked ? false : formData.soldOut,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="featured" className="font-medium cursor-pointer">
                        Featured Product
                      </Label>
                      <p className="text-sm text-gray-500">Show on homepage</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>

                  {/* Analytics Display (if editing) */}
                  {isEditing && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-pink-600" />
                        <div>
                          <p className="text-sm text-gray-600">Favorites</p>
                          <p className="text-xl font-bold">{formData.favoritesCount || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Cart Additions</p>
                          <p className="text-xl font-bold">{formData.cartAdditionsCount || 0}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowProductForm(false);
                        navigate("/admin/products");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                        color: "white",
                      }}
                    >
                      <Save className="w-4 h-4" />
                      {isEditing ? "Update Product" : "Create Product"}
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
                Are you sure you want to delete "{deleteDialog.product?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false, product: null })}>
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

