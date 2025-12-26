import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  DollarSign,
  ShoppingCart,
  Heart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Flower2,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Percent,
  CheckCircle,
  XCircle,
  Calendar,
  Star,
  Box,
  Sparkles,
  ArrowRight,
  Activity,
  BarChart3,
  Grid3x3,
  LayoutGrid,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getCollectionProducts } from "@/lib/api/collection-products";
import { encodeImageUrl } from "@/lib/imageUtils";

const GOLD_COLOR = "rgb(199, 158, 72)";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    soldOut: 0,
    seasonal: 0,
    totalFavorites: 0,
    totalCartAdditions: 0,
    activeDiscounts: 0,
    totalRevenue: "0.00",
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    // Load real stats from database
    const loadStats = async () => {
      try {
        setLoading(true);
        const products = await getCollectionProducts({ isActive: true });
        
        // Calculate real stats
        const totalProducts = products.length;
        const inStock = products.filter((p) => !p.is_out_of_stock).length;
        const outOfStock = products.filter((p) => p.is_out_of_stock).length;
        const activeDiscounts = products.filter((p) => p.discount_percentage && p.discount_percentage > 0).length;
        
        // Calculate total revenue (sum of all product prices - simplified calculation)
        // In a real scenario, this would come from orders table
        const totalRevenue = products.reduce((sum, p) => {
          const price = p.discount_percentage && p.discount_percentage > 0
            ? p.price * (1 - p.discount_percentage / 100)
            : p.price;
          // Estimate: assume each product has been viewed/purchased based on a simple calculation
          // In production, this should come from actual orders/analytics
          return sum + price;
        }, 0);

        // Get favorites and cart additions from localStorage (if available)
        // These are estimates based on user interactions stored locally
        const favoritesData = localStorage.getItem("favorites");
        const cartData = localStorage.getItem("cart");
        
        let totalFavorites = 0;
        let totalCartAdditions = 0;
        
        try {
          if (favoritesData) {
            const favorites = JSON.parse(favoritesData);
            totalFavorites = Array.isArray(favorites) ? favorites.length : 0;
          }
        } catch (e) {
          // If favorites data doesn't exist or is invalid, use 0
        }
        
        try {
          if (cartData) {
            const cart = JSON.parse(cartData);
            totalCartAdditions = Array.isArray(cart) ? cart.length : 0;
          }
        } catch (e) {
          // If cart data doesn't exist or is invalid, use 0
        }

        // Get recent products (last 5)
        const recent = [...products]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((p) => {
            const imageUrl = p.image_urls?.[0];
            return {
              id: p.id,
              name: p.title,
              price: p.price,
              image: imageUrl ? encodeImageUrl(imageUrl) : '',
              category: p.category || '',
              displayCategory: p.display_category || '',
              discount: p.discount_percentage || null,
              outOfStock: p.is_out_of_stock || false,
              soldOut: false,
              seasonal: false,
            };
          });

        setStats({
          totalProducts,
          inStock,
          outOfStock,
          soldOut: 0, // This would come from orders/analytics in production
          seasonal: 0, // This would be a flag in products table
          totalFavorites: totalFavorites || 0,
          totalCartAdditions: totalCartAdditions || 0,
          activeDiscounts,
          totalRevenue: totalRevenue.toFixed(2),
        });

        setRecentProducts(recent);
      } catch (error) {
        console.error("Error loading stats:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUsername");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/admin/login");
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
      description: undefined,
    },
    {
      title: "In Stock",
      value: stats.inStock,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      gradient: "from-green-500 to-green-600",
      description: undefined,
    },
    {
      title: "Total Revenue",
      value: `$${parseFloat(stats.totalRevenue).toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      gradient: "from-yellow-500 to-yellow-600",
      description: "Estimated from products",
    },
    {
      title: "Active Discounts",
      value: stats.activeDiscounts,
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600",
      description: undefined,
    },
    {
      title: "Favorites",
      value: stats.totalFavorites,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      gradient: "from-pink-500 to-pink-600",
      description: "From user interactions",
    },
    {
      title: "Cart Additions",
      value: stats.totalCartAdditions,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      gradient: "from-orange-500 to-orange-600",
      description: "From user interactions",
    },
  ];

  const statusStats = [
    { label: "Out of Stock", value: stats.outOfStock, icon: XCircle, color: "text-red-600", bgColor: "bg-red-50" },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Create a new product",
      icon: Plus,
      onClick: () => navigate("/admin/products/new"),
      gradient: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
      color: "white",
    },
    {
      title: "Manage Products",
      description: "Edit existing products",
      icon: Edit,
      onClick: () => navigate("/admin/products"),
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      color: "white",
    },
    {
      title: "Signature Collection",
      description: "Manage featured items",
      icon: Star,
      onClick: () => navigate("/admin/signature-collection"),
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      color: "white",
    },
    {
      title: "View Collection",
      description: "See all products",
      icon: Grid3x3,
      onClick: () => navigate("/collection"),
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
    },
  ];

  const managementSections = [
    {
      title: "Customization",
      description: "Manage customization options",
      items: [
        { title: "Luxury Boxes", icon: Box, path: "/admin/boxes", description: "Boxes, colors & sizes" },
        { title: "Flowers", icon: Flower2, path: "/admin/flowers", description: "Flower types & colors" },
        { title: "Accessories", icon: Sparkles, path: "/admin/accessories", description: "Manage accessories" },
      ],
    },
    {
      title: "Content",
      description: "Manage page content",
      items: [
        { title: "Wedding Creations", icon: ImageIcon, path: "/admin/wedding-creations", description: "Gallery photos" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Flower2 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Bexy Flowers Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/products")}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Manage</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2.5 rounded-xl shadow-sm`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                    </div>
                    {stat.description && (
                      <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Status Overview - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-lg sm:text-xl">Stock Status Overview</CardTitle>
              </div>
              <CardDescription>Quick view of product availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statusStats.map((status, index) => {
                  const Icon = status.icon;
                  return (
                    <motion.div
                      key={status.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`flex items-center gap-4 p-4 ${status.bgColor} rounded-xl border border-gray-100 hover:shadow-md transition-shadow`}
                    >
                      <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                        <Icon className={`w-6 h-6 ${status.color}`} />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{status.label}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {status.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
              </div>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.onClick}
                      className="relative rounded-xl p-6 text-left transition-shadow duration-200 shadow-md hover:shadow-lg"
                      style={{
                        background: action.gradient,
                        color: action.color,
                      }}
                    >
                      <div>
                        <div className="mb-3">
                          <Icon className="w-8 h-8 mb-2" />
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-1">{action.title}</h3>
                        <p className="text-xs sm:text-sm opacity-90">{action.description}</p>
                        <ArrowRight className="w-4 h-4 mt-3 opacity-70" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Management Sections - Enhanced */}
        {managementSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + sectionIndex * 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + sectionIndex * 0.1 + index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(item.path)}
                        className="p-5 border-2 border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left bg-white"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-gray-50">
                            <Icon className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base mb-1 text-gray-900">{item.title}</h3>
                            <p className="text-xs text-gray-500">{item.description}</p>
                            <ArrowRight className="w-4 h-4 mt-2 text-gray-400" />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Recent Products - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-gray-600" />
                  Recent Products
                </CardTitle>
                <CardDescription className="mt-1">Latest products in your store</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/products")}
                className="gap-2 w-full sm:w-auto"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">Image</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {product.displayCategory || product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                            {product.discount && product.discount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {product.discount}% OFF
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.outOfStock ? (
                            <Badge variant="outline" className="text-xs border-red-300 text-red-600">Out of Stock</Badge>
                          ) : (
                            <Badge className="bg-green-500 text-white text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/products/${product.id}`)}
                            className="gap-1 hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
