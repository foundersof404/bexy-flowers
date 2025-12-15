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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatedBouquets } from "@/data/generatedBouquets";

const GOLD_COLOR = "rgb(199, 158, 72)";

// Mock data - replace with actual API calls
const getMockStats = () => {
  const totalProducts = generatedBouquets.length;
  const inStock = generatedBouquets.filter((p) => !(p as any).outOfStock && !(p as any).soldOut && !(p as any).seasonal).length;
  const outOfStock = generatedBouquets.filter((p) => (p as any).outOfStock).length;
  const soldOut = generatedBouquets.filter((p) => (p as any).soldOut).length;
  const seasonal = generatedBouquets.filter((p) => (p as any).seasonal).length;
  
  // Mock analytics
  const totalFavorites = Math.floor(Math.random() * 500) + 150;
  const totalCartAdditions = Math.floor(Math.random() * 300) + 100;
  const activeDiscounts = generatedBouquets.filter((p) => (p as any).discount && (p as any).discount > 0).length;
  const totalRevenue = generatedBouquets.reduce((sum, p) => {
    const price = (p as any).discount ? p.price * (1 - (p as any).discount / 100) : p.price;
    return sum + price * (Math.floor(Math.random() * 10) + 1);
  }, 0);

  return {
    totalProducts,
    inStock,
    outOfStock,
    soldOut,
    seasonal,
    totalFavorites,
    totalCartAdditions,
    activeDiscounts,
    totalRevenue: totalRevenue.toFixed(2),
  };
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(getMockStats());
  const [recentProducts, setRecentProducts] = useState(generatedBouquets.slice(0, 5));
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

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
    },
    {
      title: "In Stock",
      value: stats.inStock,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Active Discounts",
      value: stats.activeDiscounts,
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Favorites",
      value: stats.totalFavorites,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Cart Additions",
      value: stats.totalCartAdditions,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const statusStats = [
    { label: "Out of Stock", value: stats.outOfStock, icon: XCircle, color: "text-red-600" },
    { label: "Sold Out", value: stats.soldOut, icon: AlertCircle, color: "text-gray-600" },
    { label: "Seasonal", value: stats.seasonal, icon: Calendar, color: "text-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${GOLD_COLOR}15` }}
              >
                <Flower2 className="w-5 h-5" style={{ color: GOLD_COLOR }} />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold" style={{ color: "#1a1a1a" }}>
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">Bexy Flowers Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/products")}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1a1a1a" }}>
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stock Status Overview</CardTitle>
            <CardDescription>Quick view of product availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statusStats.map((status) => {
                const Icon = status.icon;
                return (
                  <div key={status.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Icon className={`w-8 h-8 ${status.color}`} />
                    <div>
                      <p className="text-sm text-gray-600">{status.label}</p>
                      <p className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>
                        {status.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => navigate("/admin/products/new")}
                className="h-auto flex-col gap-2 py-6"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                  color: "white",
                }}
              >
                <Plus className="w-6 h-6" />
                <span>Add Product</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/products")}
                className="h-auto flex-col gap-2 py-6"
              >
                <Edit className="w-6 h-6" />
                <span>Edit Products</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/signature-collection")}
                className="h-auto flex-col gap-2 py-6"
              >
                <ImageIcon className="w-6 h-6" />
                <span>Signature Collection</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/accessories")}
                className="h-auto flex-col gap-2 py-6"
              >
                <Package className="w-6 h-6" />
                <span>Accessories</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Page Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Custom Page Management</CardTitle>
            <CardDescription>Manage luxury boxes, flowers, and accessories for custom bouquets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/boxes")}
                className="h-auto flex-col gap-2 py-6"
              >
                <Package className="w-6 h-6" />
                <span>Luxury Boxes</span>
                <span className="text-xs text-gray-500">Manage boxes, colors & sizes</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/flowers")}
                className="h-auto flex-col gap-2 py-6"
              >
                <Flower2 className="w-6 h-6" />
                <span>Flowers</span>
                <span className="text-xs text-gray-500">Manage flower types & colors</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/accessories")}
                className="h-auto flex-col gap-2 py-6"
              >
                <Package className="w-6 h-6" />
                <span>Accessories</span>
                <span className="text-xs text-gray-500">Manage accessories</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wedding & Events Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Wedding & Events Management</CardTitle>
            <CardDescription>Manage photos for the Wedding & Events page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/wedding-creations")}
                className="h-auto flex-col gap-2 py-6"
              >
                <ImageIcon className="w-6 h-6" />
                <span>Wedding Creations</span>
                <span className="text-xs text-gray-500">Manage gallery photos</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest products in your store</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/products")}
              className="gap-2"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.displayCategory || product.category}</TableCell>
                    <TableCell>
                      ${product.price}
                      {(product as any).discount && (
                        <Badge variant="secondary" className="ml-2">
                          {(product as any).discount}% OFF
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {(product as any).soldOut ? (
                        <Badge variant="destructive">Sold Out</Badge>
                      ) : (product as any).outOfStock ? (
                        <Badge variant="outline">Out of Stock</Badge>
                      ) : (product as any).seasonal ? (
                        <Badge className="bg-blue-500">Seasonal</Badge>
                      ) : (
                        <Badge className="bg-green-500">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                        className="gap-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;

